import express from "express";
import upload from "../config/multer.js";
import {
  createCourse,
  getAllCourses,
  getAllAdminCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollFreeCourse,
  getMyCourses,
  updateLessonProgress,
  checkVideoAccess,
} from "../Controller/courseController.js";
import { verifyUser, authorizeRoles, optionalAuth } from "../helper/userAuth.js";

const router = express.Router();

// Public & Admin Course Endpoints
router
  .route("/course")
  .get(getAllCourses)
  .post(
    verifyUser,
    authorizeRoles("admin"),
    upload.fields([
      { name: "courseImage", maxCount: 5 },
      { name: "courseVideo", maxCount: 20 },
    ]),
    createCourse
  );

router.get("/admin/courses", verifyUser, authorizeRoles("admin"), getAllAdminCourses);

// Student My Courses
router.get("/my-courses", verifyUser, getMyCourses);

// Single Course Details, Updates, Deletions
router
  .route("/course/:id")
  .get(optionalAuth, getCourseById)
  .put(
    verifyUser,
    authorizeRoles("admin"),
    upload.fields([
      { name: "courseImage", maxCount: 5 },
      { name: "courseVideo", maxCount: 20 },
    ]),
    updateCourse
  )
  .delete(verifyUser, authorizeRoles("admin"), deleteCourse);

// Free Course Enrollment
router.post("/course/:id/enroll", verifyUser, enrollFreeCourse);

// Course Lesson Progress
router.post("/course/:id/progress", verifyUser, updateLessonProgress);

// Video Streaming Access Validation (Protects paid lessons!)
router.get("/course/:id/video-access/:videoIndex", optionalAuth, checkVideoAccess);

export default router;
