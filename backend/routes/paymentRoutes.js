import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
  getMyPayments,
  getAllAdminPayments,
  getAllAdminEnrollments,
  getAdminStats,
} from "../Controller/paymentController.js";
import { verifyUser, authorizeRoles } from "../helper/userAuth.js";

const router = express.Router();

// Student Payment Flow
router.post("/payment/create-order", verifyUser, createRazorpayOrder);
router.post("/payment/verify", verifyUser, verifyPayment);
router.get("/payment/my-payments", verifyUser, getMyPayments);

// Admin Analytics & Records
router.get("/admin/payments", verifyUser, authorizeRoles("admin"), getAllAdminPayments);
router.get("/admin/enrollments", verifyUser, authorizeRoles("admin"), getAllAdminEnrollments);
router.get("/admin/stats", verifyUser, authorizeRoles("admin"), getAdminStats);

export default router;
