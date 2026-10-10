import express from "express";
import {
  cancelSubscription,
  createSubscriptionOrder,
  getAdminSubscriptions,
  getMySubscription,
  verifySubscriptionPayment,
} from "../Controller/subscriptionController.js";
import { authorizeRoles, verifyUser } from "../helper/userAuth.js";

const router = express.Router();

router.get("/subscription/me", verifyUser, getMySubscription);
router.post("/subscription/create-order", verifyUser, createSubscriptionOrder);
router.post("/subscription/verify", verifyUser, verifySubscriptionPayment);
router.get("/admin/subscriptions", verifyUser, authorizeRoles("admin"), getAdminSubscriptions);
router.patch("/admin/subscription/:id/cancel", verifyUser, authorizeRoles("admin"), cancelSubscription);

export default router;