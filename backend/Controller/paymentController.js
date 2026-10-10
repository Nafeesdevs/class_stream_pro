import crypto from "crypto";
import Razorpay from "razorpay";
import Payment from "../model/paymentModel.js";
import Enrollment from "../model/enrollmentModel.js";
import Course from "../model/courseModel.js";
import User from "../model/userModel.js";
import Category from "../model/categoryModel.js";
import Class from "../model/classModel.js";
import HandleError from "../helper/handleError.js";

// Helper to initialize Razorpay instance
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) throw new Error("Razorpay credentials are not configured");
  return new Razorpay({
    key_id,
    key_secret,
  });
};

// Create Razorpay Order (POST /api/v1/payment/create-order)
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    if (!courseId) {
      return next(new HandleError("Course ID is required", 400));
    }

    // SERVER-AUTHORITATIVE: Fetch course directly from database
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HandleError("Course not found", 404));
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      status: "active",
    });

    if (existingEnrollment) {
      return next(new HandleError("You are already enrolled in this course", 400));
    }

    // Server-verified amount in INR (convert to paise: 1 INR = 100 paise)
    const amountInINR = Number(course.price) || 0;
    if (amountInINR <= 0) {
      return next(new HandleError("This course is free. Use the free enroll option.", 400));
    }

    const amountInPaise = Math.round(amountInINR * 100);
    const receiptId = `rcpt_${Date.now()}_${userId.toString().slice(-4)}`;

    let razorpayOrderId;
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (keyId && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = getRazorpayInstance();
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: receiptId,
        notes: {
          courseId: course._id.toString(),
          userId: userId.toString(),
          courseName: course.courseName.slice(0, 30),
        },
      };

      const order = await razorpay.orders.create(options);
      razorpayOrderId = order.id;
    } else if (process.env.NODE_ENV !== "production") {
      razorpayOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    } else {
      return next(new HandleError("Payment service is not configured.", 503));
    }

    // Create Payment record in DB with 'created' status
    const payment = await Payment.create({
      user: userId,
      course: course._id,
      razorpayOrderId,
      amount: amountInINR,
      currency: "INR",
      status: "created",
    });

    res.status(200).json({
      success: true,
      order: {
        id: razorpayOrderId,
        amount: amountInPaise,
        currency: "INR",
        courseName: course.courseName,
        courseThumbnail: course.courseImage?.[0]?.url || "",
      },
      paymentId: payment._id,
      keyId: keyId || null,
    });
  } catch (error) {
    next(error);
  }
};

// Verify Payment Signature (POST /api/v1/payment/verify)
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;
    const userId = req.user._id;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return next(new HandleError("Payment reference IDs are missing", 400));
    }

    // Verify HMAC SHA256 Signature
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      user: userId,
      type: "course",
    });
    if (!payment) return next(new HandleError("Payment order not found for this account.", 404));
    if (courseId && String(payment.course) !== String(courseId)) {
      return next(new HandleError("Payment order does not match the selected course.", 400));
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (secret) {
      const expected = crypto.createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      const actualBuffer = Buffer.from(String(razorpay_signature || ""));
      const expectedBuffer = Buffer.from(expected);
      if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
        return next(new HandleError("Payment verification failed. Invalid signature.", 400));
      }
    } else if (
      process.env.NODE_ENV === "production" ||
      !razorpay_order_id.startsWith("order_test_") ||
      !razorpay_payment_id.startsWith("pay_test_")
    ) {
      return next(new HandleError("Payment verification is not configured.", 503));
    }

    const course = await Course.findById(payment.course);
    if (!course) return next(new HandleError("Course associated with payment not found", 404));

    if (payment.status !== "paid") {
      payment.status = "paid";
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature || "test_signature";
      payment.paidAt = new Date();
      await payment.save();
    }

    // Create Enrollment or activate if already created
    let enrollment = await Enrollment.findOne({ user: userId, course: course._id });
    if (!enrollment) {
      enrollment = await Enrollment.create({
        user: userId,
        course: course._id,
        payment: payment._id,
        status: "active",
        enrolledAt: new Date(),
      });
    } else if (enrollment.status !== "active") {
      enrollment.status = "active";
      enrollment.payment = payment._id;
      await enrollment.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully. Welcome to the course!",
      payment: {
        id: payment._id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt,
      },
      enrollmentId: enrollment._id,
      course: {
        _id: course._id,
        courseName: course.courseName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get My Payments (GET /api/v1/payment/my-payments)
export const getMyPayments = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const payments = await Payment.find({ user: userId })
      .populate("course", "courseName courseImage price")
      .populate("plan", "name durationMonths classLimit")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
      count: payments.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Payments (Admin) (GET /api/v1/admin/payments)
export const getAllAdminPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("course", "courseName price")
      .populate("plan", "name durationMonths classLimit")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
      count: payments.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Enrollments (Admin) (GET /api/v1/admin/enrollments)
export const getAllAdminEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name email")
      .populate("course", "courseName price courseCategory")
      .populate("payment", "amount status razorpayPaymentId")
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      enrollments,
      count: enrollments.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get Admin Dashboard Overview Statistics (GET /api/v1/admin/stats)
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalClasses = await Class.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments({ status: "active" });

    // Aggregate payments
    const paidPayments = await Payment.find({ status: "paid" });
    const totalPaymentsCount = paidPayments.length;
    const totalRevenue = paidPayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    // Recent 5 payments
    const recentPayments = await Payment.find({ status: "paid" })
      .populate("user", "name email")
      .populate("course", "courseName")
      .sort({ paidAt: -1 })
      .limit(5);

    // Recent 5 users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        totalCategories,
        totalClasses,
        totalEnrollments,
        totalPayments: totalPaymentsCount,
        totalRevenue,
      },
      recentPayments,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};
