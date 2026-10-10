import express from "express";
import { getGrowthHighlights, updateGrowthHighlights } from "../Controller/growthHighlightController.js";
import { verifyUser, authorizeRoles } from "../helper/userAuth.js";

const router = express.Router();

router
  .route("/growth-highlights")
  .get(getGrowthHighlights)
  .put(verifyUser, authorizeRoles("admin"), updateGrowthHighlights);

export default router;