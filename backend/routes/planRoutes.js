import express from "express";
import {
  createPlan,
  deletePlan,
  getAdminPlans,
  getPlans,
  updatePlan,
} from "../Controller/planController.js";
import { authorizeRoles, verifyUser } from "../helper/userAuth.js";

const router = express.Router();

router.get("/plans", getPlans);
router.get("/admin/plans", verifyUser, authorizeRoles("admin"), getAdminPlans);
router.post("/plan", verifyUser, authorizeRoles("admin"), createPlan);
router.put("/plan/:id", verifyUser, authorizeRoles("admin"), updatePlan);
router.delete("/plan/:id", verifyUser, authorizeRoles("admin"), deletePlan);

export default router;