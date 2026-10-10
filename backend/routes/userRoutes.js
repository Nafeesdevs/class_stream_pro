// import express from "express";
// import {
//   deleteUser,
//   getAllUser,
//   createAdminManagedUser,
//   getUserById,
//   loginUser,
//   registerUser,
//   updateUser,
//   logoutUser,
//   getCurrentUser,
//   updateProfile,
// } from "../Controller/userController.js";
// import { verifyUser, authorizeRoles } from "../helper/userAuth.js";

// const router = express.Router();

// // Authentication
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.route("/logout").get(logoutUser).post(logoutUser);

// // Profile
// router.get("/me", verifyUser, getCurrentUser);
// router.put("/me/update", verifyUser, updateProfile);

// // Admin User Management
// router.get("/users", verifyUser, authorizeRoles("admin"), getAllUser);
// router.post("/admin/users", verifyUser, authorizeRoles("admin"), createAdminManagedUser);
// router
//   .route("/user/:id")
//   .get(verifyUser, getUserById)
//   .put(verifyUser, authorizeRoles("admin"), updateUser)
//   .delete(verifyUser, authorizeRoles("admin"), deleteUser);

// export default router;

import express from "express";
import {
  deleteUser,
  getAllUser,
  createAdminManagedUser,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
} from "../Controller/userController.js";
import {
  verifyPasswordForDeletion,
  requestAccountDeletion,
  getDeletionRequests,
  approveDeletionRequest,
  rejectDeletionRequest,
} from "../Controller/accountDeletionController.js";
import { verifyUser, authorizeRoles } from "../helper/userAuth.js";

const router = express.Router();

// Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/logout").get(logoutUser).post(logoutUser);

// Profile
router.get("/me", verifyUser, getCurrentUser);
router.put("/me/update", verifyUser, updateProfile);

// Delete my account (user side): 1) verify password  2) send request with reason
router.post("/me/delete-account/verify", verifyUser, verifyPasswordForDeletion);
router.post("/me/delete-account/request", verifyUser, requestAccountDeletion);

// Account deletion requests (admin side)
router.get("/admin/deletion-requests", verifyUser, authorizeRoles("admin"), getDeletionRequests);
router.put(
  "/admin/deletion-requests/:id/approve",
  verifyUser,
  authorizeRoles("admin"),
  approveDeletionRequest
);
router.put(
  "/admin/deletion-requests/:id/reject",
  verifyUser,
  authorizeRoles("admin"),
  rejectDeletionRequest
);

// Admin User Management
router.get("/users", verifyUser, authorizeRoles("admin"), getAllUser);
router.post("/admin/users", verifyUser, authorizeRoles("admin"), createAdminManagedUser);
router
  .route("/user/:id")
  .get(verifyUser, getUserById)
  .put(verifyUser, authorizeRoles("admin"), updateUser)
  .delete(verifyUser, authorizeRoles("admin"), deleteUser);

export default router;
