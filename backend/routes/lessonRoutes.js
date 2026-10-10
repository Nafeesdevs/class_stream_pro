import express from "express";
import upload from "../config/multer.js";
import {
  accessLessonVideo,
  addLessonVideo,
  createLesson,
  deleteLesson,
  deleteLessonVideo,
  getAdminLessons,
  getLessons,
  updateLesson,
  updateLessonVideo,
} from "../Controller/lessonController.js";
import { authorizeRoles, optionalAuth, verifyUser } from "../helper/userAuth.js";

const router = express.Router();

router.get("/lessons", optionalAuth, getLessons);
router.get("/admin/lessons", verifyUser, authorizeRoles("admin"), getAdminLessons);
router.post("/lesson", verifyUser, authorizeRoles("admin"), createLesson);
router.put("/lesson/:id", verifyUser, authorizeRoles("admin"), updateLesson);
router.delete("/lesson/:id", verifyUser, authorizeRoles("admin"), deleteLesson);
router.post("/lesson/:id/videos", verifyUser, authorizeRoles("admin"), upload.single("video"), addLessonVideo);
router.put("/lesson/:id/videos/:videoId", verifyUser, authorizeRoles("admin"), upload.single("video"), updateLessonVideo);
router.delete("/lesson/:id/videos/:videoId", verifyUser, authorizeRoles("admin"), deleteLessonVideo);
router.post("/lessons/:id/videos/:videoId/access", optionalAuth, accessLessonVideo);

export default router;