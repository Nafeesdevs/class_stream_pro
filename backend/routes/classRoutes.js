import express from "express";
import {
  createClass,
  deleteClass,
  getAllClass,
  updateClass,
} from "../Controller/classController.js";
import { verifyUser, authorizeRoles } from "../helper/userAuth.js";

const router = express.Router();

router
  .route("/class")
  .get(getAllClass)
  .post(verifyUser, authorizeRoles("admin"), createClass);

router
  .route("/class/:id")
  .put(verifyUser, authorizeRoles("admin"), updateClass)
  .delete(verifyUser, authorizeRoles("admin"), deleteClass);

export default router;
