import express from "express";
import upload from "../config/multer.js";
import {
  createcategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../Controller/categoryController.js";
import { verifyUser, authorizeRoles } from "../helper/userAuth.js";

const router = express.Router();

router
  .route("/category")
  .get(getAllCategory)
  .post(verifyUser, authorizeRoles("admin"), upload.array("categoryImage"), createcategory);

router
  .route("/category/:id")
  .put(verifyUser, authorizeRoles("admin"), upload.array("categoryImage"), updateCategory)
  .delete(verifyUser, authorizeRoles("admin"), deleteCategory);

export default router;
