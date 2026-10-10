import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import Enrollment from "../model/enrollmentModel.js";
import DeletionRequest from "../model/deletionRequestModel.js";
import HandleError from "../helper/handleError.js";

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

// The verification token uses a DIFFERENT secret from the login token, so it
// can never be used as a session cookie / Bearer token.
const verificationSecret = () =>
  `${process.env.JWT_SECRET_KEY || "jwt@class_stream_secret_key_1607@"}:account-deletion`;

const VERIFICATION_TTL = "10m";
const VERIFICATION_TTL_SECONDS = 10 * 60;

// Small in-memory brute-force guard for the password check:
// 5 wrong passwords => locked for 15 minutes (per user).
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;
const failedAttempts = new Map();

const isLockedOut = (userId) => {
  const entry = failedAttempts.get(userId);
  if (!entry) return false;
  if (entry.resetAt <= Date.now()) {
    failedAttempts.delete(userId);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
};

const recordFailure = (userId) => {
  const now = Date.now();
  const entry = failedAttempts.get(userId);
  if (!entry || entry.resetAt <= now) {
    failedAttempts.set(userId, { count: 1, resetAt: now + LOCK_WINDOW_MS });
  } else {
    entry.count += 1;
  }
};

/* ------------------------------------------------------------------ *
 * USER SIDE
 * ------------------------------------------------------------------ */

// Step 1 - POST /api/v1/me/delete-account/verify   { password }
// Checks the password and returns a short-lived verification token.
export const verifyPasswordForDeletion = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (req.user.role === "admin") {
      return next(new HandleError("Administrator accounts cannot be deleted from here.", 403));
    }
    if (!password) {
      return next(new HandleError("Please enter your password.", 400));
    }

    const userId = String(req.user._id);
    if (isLockedOut(userId)) {
      return next(
        new HandleError("Too many incorrect attempts. Please try again in a few minutes.", 429)
      );
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(new HandleError("User not found", 404));
    }

    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      recordFailure(userId);
      return next(new HandleError("Incorrect password. Please try again.", 401));
    }

    failedAttempts.delete(userId);

    const verificationToken = jwt.sign(
      { id: userId, purpose: "account-deletion" },
      verificationSecret(),
      { expiresIn: VERIFICATION_TTL }
    );

    res.status(200).json({
      success: true,
      verificationToken,
      expiresInSeconds: VERIFICATION_TTL_SECONDS,
    });
  } catch (error) {
    next(error);
  }
};

// Step 2 - POST /api/v1/me/delete-account/request   { verificationToken, reason }
// Creates the pending request. The user is locked out until the admin decides.
export const requestAccountDeletion = async (req, res, next) => {
  try {
    const { verificationToken, reason } = req.body;

    if (req.user.role === "admin") {
      return next(new HandleError("Administrator accounts cannot be deleted from here.", 403));
    }

    // 1) The password step must have been completed recently, by THIS user.
    let decoded;
    try {
      decoded = jwt.verify(verificationToken || "", verificationSecret());
    } catch (err) {
      return next(
        new HandleError(
          "Password verification expired. Please verify your password again.",
          401,
          "VERIFICATION_EXPIRED"
        )
      );
    }
    if (decoded.purpose !== "account-deletion" || String(decoded.id) !== String(req.user._id)) {
      return next(
        new HandleError(
          "Password verification is not valid. Please verify your password again.",
          401,
          "VERIFICATION_EXPIRED"
        )
      );
    }

    // 2) Reason is mandatory.
    const cleanReason = typeof reason === "string" ? reason.trim() : "";
    if (cleanReason.length < 10) {
      return next(new HandleError("Please describe your reason in at least 10 characters.", 400));
    }
    if (cleanReason.length > 500) {
      return next(new HandleError("Reason must be 500 characters or fewer.", 400));
    }

    // 3) Only one pending request per user.
    const alreadyPending = await DeletionRequest.findOne({ user: req.user._id, status: "pending" });
    if (alreadyPending) {
      return next(new HandleError("You already have a pending deletion request.", 409));
    }

    const enrollmentsCount = await Enrollment.countDocuments({ user: req.user._id });

    try {
      await DeletionRequest.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        enrollmentsCount,
        reason: cleanReason,
      });
    } catch (err) {
      if (err.code === 11000) {
        return next(new HandleError("You already have a pending deletion request.", 409));
      }
      throw err;
    }

    // 4) Lock the account: no login, existing sessions are rejected.
    await User.findByIdAndUpdate(req.user._id, { deletionRequestStatus: "pending" });

    res.status(201).json({
      success: true,
      message:
        "Your account deletion request has been sent to the admin. You will not be able to sign in until it is reviewed.",
    });
  } catch (error) {
    next(error);
  }
};

/* ------------------------------------------------------------------ *
 * ADMIN SIDE
 * ------------------------------------------------------------------ */

// GET /api/v1/admin/deletion-requests
export const getDeletionRequests = async (req, res, next) => {
  try {
    const requests = await DeletionRequest.find().sort({ createdAt: -1 });
    const pendingCount = requests.filter((item) => item.status === "pending").length;

    res.status(200).json({
      success: true,
      requests,
      count: requests.length,
      pendingCount,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/admin/deletion-requests/:id/approve
// Permanently deletes the user (and their enrollments).
export const approveDeletionRequest = async (req, res, next) => {
  try {
    const request = await DeletionRequest.findById(req.params.id);
    if (!request) {
      return next(new HandleError("Deletion request not found", 404));
    }
    if (request.status !== "pending") {
      return next(new HandleError("This request has already been reviewed.", 400));
    }
    if (String(request.user) === String(req.user._id)) {
      return next(new HandleError("You cannot approve your own deletion request.", 400));
    }

    const user = await User.findById(request.user);
    if (user && user.role === "admin") {
      return next(new HandleError("Administrator accounts cannot be deleted from here.", 403));
    }

    // Delete the data first, then close the request. If anything fails in the
    // middle the request stays "pending" and can simply be approved again.
    if (user) {
      await Enrollment.deleteMany({ user: user._id });
      await User.findByIdAndDelete(user._id);
    }

    const updated = await DeletionRequest.findOneAndUpdate(
      { _id: request._id, status: "pending" },
      {
        status: "approved",
        reviewedBy: req.user._id,
        reviewedByName: req.user.name,
        reviewedAt: new Date(),
      },
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      message: "Request approved. The account has been permanently deleted.",
      request: updated || request,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/admin/deletion-requests/:id/reject
// Keeps the account and lets the user sign in again.
export const rejectDeletionRequest = async (req, res, next) => {
  try {
    const request = await DeletionRequest.findById(req.params.id);
    if (!request) {
      return next(new HandleError("Deletion request not found", 404));
    }
    if (request.status !== "pending") {
      return next(new HandleError("This request has already been reviewed.", 400));
    }

    // Unlock the user first, then close the request.
    await User.findByIdAndUpdate(request.user, { deletionRequestStatus: "none" });

    const updated = await DeletionRequest.findOneAndUpdate(
      { _id: request._id, status: "pending" },
      {
        status: "rejected",
        reviewedBy: req.user._id,
        reviewedByName: req.user.name,
        reviewedAt: new Date(),
      },
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      message: "Request rejected. The user can sign in again.",
      request: updated || request,
    });
  } catch (error) {
    next(error);
  }
};
