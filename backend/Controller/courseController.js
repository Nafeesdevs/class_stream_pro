import Course from "../model/courseModel.js";
import Enrollment from "../model/enrollmentModel.js";
import HandleError from "../helper/handleError.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Helper for safe Cloudinary upload (with local fallback)
const uploadMediaSafely = async (file, resourceType = "image") => {
  try {
    const options = {
      folder: "class_stream/courses",
      resource_type: resourceType,
    };
    const result = await cloudinary.uploader.upload(file.path, options);

    // Clean up local temp file
    try {
      fs.unlinkSync(file.path);
    } catch (e) { }

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.warn(`Cloudinary ${resourceType} upload failed, using local fallback:`, error.message);
    const fallbackUrl = `/upload/${file.filename}`;
    return {
      public_id: `local_${Date.now()}_${file.filename}`,
      url: fallbackUrl,
    };
  }
};

// Create Course (POST /api/v1/course)
export const createCourse = async (req, res, next) => {
  try {
    const {
      courseName,
      courseDescription,
      courseCategory,
      courseClass,
      price,
      originalPrice,
      isPaid,
      isActive,
      instructor,
      level,
      duration,
      videoAccessTypes, // Can be array or JSON string
      videoTitles,
    } = req.body;

    if (!courseName || !courseDescription || !courseCategory || !courseClass) {
      return next(
        new HandleError(
          "Course name, description, category, and class are required",
          400
        )
      );
    }

    // Parse video access types if provided
    let parsedAccessTypes = [];
    if (videoAccessTypes) {
      try {
        parsedAccessTypes = typeof videoAccessTypes === "string"
          ? JSON.parse(videoAccessTypes)
          : videoAccessTypes;
      } catch (e) {
        parsedAccessTypes = [];
      }
    }

    let parsedTitles = [];
    if (videoTitles) {
      try {
        parsedTitles = typeof videoTitles === "string"
          ? JSON.parse(videoTitles)
          : videoTitles;
      } catch (e) {
        parsedTitles = [];
      }
    }

    let parsedVideos = [];
    if (req.body.courseVideo) {
      try {
        parsedVideos = typeof req.body.courseVideo === "string"
          ? JSON.parse(req.body.courseVideo)
          : req.body.courseVideo;
      } catch (e) {
        parsedVideos = [];
      }
    }

    // Upload course images
    const courseImage = [];
    if (req.files?.courseImage && req.files.courseImage.length > 0) {
      for (const file of req.files.courseImage) {
        const img = await uploadMediaSafely(file, "image");
        courseImage.push(img);
      }
    } else {
      // Default course thumbnail
      courseImage.push({
        public_id: "default_course_thumb",
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
      });
    }

    // Upload course videos
    const courseVideo = [];
    if (req.files?.courseVideo && req.files.courseVideo.length > 0) {
      let index = 0;
      for (const file of req.files.courseVideo) {
        const vid = await uploadMediaSafely(file, "video");
        const customTitle = parsedTitles[index] || parsedVideos[index]?.title || file.originalname.replace(/\.[^/.]+$/, "");
        const accessType = parsedAccessTypes[index] || parsedVideos[index]?.accessType || (index === 0 ? "free" : (index === 1 ? "trial" : "subscription"));

        courseVideo.push({
          public_id: vid.public_id,
          url: vid.url,
          title: customTitle,
          duration: "14:20",
          accessType,
        });
        index++;
      }
    } else if (Array.isArray(parsedVideos)) {
      courseVideo.push(
        ...parsedVideos
          .filter((video) => video && video.url)
          .map((video, index) => ({
            public_id: video.public_id || `external_${Date.now()}_${index}`,
            url: video.url,
            title: video.title || `Lesson ${index + 1}`,
            duration: video.duration || "",
            accessType: video.accessType || (index === 0 ? "free" : "subscription"),
          }))
      );
    }

    const numericPrice = Number(price) || 0;
    const numericOriginalPrice = Number(originalPrice) || (numericPrice > 0 ? Math.round(numericPrice * 1.5) : 0);
    const booleanIsPaid = isPaid === "true" || isPaid === true || numericPrice > 0;

    const course = await Course.create({
      courseName: courseName.trim(),
      courseDescription: courseDescription.trim(),
      courseCategory: courseCategory.trim(),
      courseClass: courseClass.trim(),
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      currency: "INR",
      isPaid: booleanIsPaid,
      isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
      instructor: instructor || "Prof. Sarah Jenkins",
      level: level || "All Levels",
      duration: duration || "8h 30m",
      courseImage,
      courseVideo,
    });

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// Public requests only include active courses; admins can request the full list.
const listCourses = async (req, res, next, includeInactive = false) => {
  try {
    const { keyword, category, courseClass, accessType, sort } = req.query;

    const query = includeInactive ? {} : { isActive: { $ne: false } };

    if (keyword && keyword.trim() !== "") {
      query.$or = [
        { courseName: { $regex: keyword.trim(), $options: "i" } },
        { courseDescription: { $regex: keyword.trim(), $options: "i" } },
        { instructor: { $regex: keyword.trim(), $options: "i" } },
      ];
    }

    if (category && category !== "all" && category.trim() !== "") {
      query.courseCategory = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    if (courseClass && courseClass !== "all" && courseClass.trim() !== "") {
      query.courseClass = { $regex: new RegExp(`^${courseClass.trim()}$`, "i") };
    }

    if (accessType) {
      if (accessType === "free") {
        query.isPaid = false;
      } else if (accessType === "paid") {
        query.isPaid = true;
      }
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-low") {
      sortOption = { price: 1 };
    } else if (sort === "price-high") {
      sortOption = { price: -1 };
    } else if (sort === "rating") {
      sortOption = { rating: -1 };
    } else if (sort === "popular") {
      sortOption = { reviewsCount: -1 };
    }

    const courses = await Course.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = (req, res, next) => listCourses(req, res, next);

export const getAllAdminCourses = (req, res, next) => listCourses(req, res, next, true);

// Get Course By ID (GET /api/v1/course/:id)
export const getCourseById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const course = await Course.findById(id);

    if (!course) {
      return next(new HandleError("Course not found", 404));
    }

    if (!course.isActive && req.user?.role !== "admin") {
      return next(new HandleError("Course not found", 404));
    }

    let isEnrolled = false;
    let userProgress = null;

    if (req.user) {
      const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: course._id,
        status: "active",
      });

      if (enrollment) {
        isEnrolled = true;
        userProgress = {
          completedLessons: enrollment.completedLessons || [],
          lastWatchedLesson: enrollment.lastWatchedLesson || 0,
          enrolledAt: enrollment.enrolledAt,
        };
      }
    }

    res.status(200).json({
      success: true,
      course,
      isEnrolled,
      userProgress,
    });
  } catch (error) {
    next(error);
  }
};

// Update Course (PUT /api/v1/course/:id)
export const updateCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    let course = await Course.findById(id);

    if (!course) {
      return next(new HandleError("Course not found", 404));
    }

    const updateData = { ...req.body };
    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === "true" || req.body.isActive === true;
    }
    let parsedVideos = [];
    if (req.body.courseVideo) {
      try {
        parsedVideos = typeof req.body.courseVideo === "string"
          ? JSON.parse(req.body.courseVideo)
          : req.body.courseVideo;
        if (Array.isArray(parsedVideos)) {
          updateData.courseVideo = parsedVideos.filter((video) => video && video.url);
        }
      } catch (e) {
        delete updateData.courseVideo;
      }
    }

    if (req.body.price !== undefined) {
      updateData.price = Number(req.body.price);
      if (req.body.isPaid === undefined) {
        updateData.isPaid = updateData.price > 0;
      }
    }
    if (req.body.originalPrice !== undefined) {
      updateData.originalPrice = Number(req.body.originalPrice);
    }
    if (req.body.isPaid !== undefined) {
      updateData.isPaid = req.body.isPaid === "true" || req.body.isPaid === true;
    }

    // Handle any newly uploaded images
    if (req.files?.courseImage && req.files.courseImage.length > 0) {
      const newImages = [];
      for (const file of req.files.courseImage) {
        const img = await uploadMediaSafely(file, "image");
        newImages.push(img);
      }
      updateData.courseImage = [...course.courseImage, ...newImages];
    }

    // Handle any newly uploaded videos
    if (req.files?.courseVideo && req.files.courseVideo.length > 0) {
      const newVideos = [];
      for (const [index, file] of req.files.courseVideo.entries()) {
        const vid = await uploadMediaSafely(file, "video");
        newVideos.push({
          public_id: vid.public_id,
          url: vid.url,
          title: parsedVideos[index]?.title || file.originalname.replace(/\.[^/.]+$/, ""),
          duration: "15:00",
          accessType: parsedVideos[index]?.accessType || "subscription",
        });
      }
      updateData.courseVideo = [...(updateData.courseVideo || course.courseVideo), ...newVideos];
    }

    course = await Course.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Course (DELETE /api/v1/course/:id)
export const deleteCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const course = await Course.findById(id);

    if (!course) {
      return next(new HandleError("Course not found", 404));
    }

    // Attempt to remove Cloudinary resources
    for (const img of course.courseImage) {
      if (img.public_id && !img.public_id.startsWith("local_") && !img.public_id.startsWith("default_")) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (e) { }
      }
    }
    for (const vid of course.courseVideo) {
      if (vid.public_id && !vid.public_id.startsWith("local_")) {
        try {
          await cloudinary.uploader.destroy(vid.public_id, { resource_type: "video" });
        } catch (e) { }
      }
    }

    await Course.findByIdAndDelete(id);
    await Enrollment.deleteMany({ course: id });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Enroll in Free Course (POST /api/v1/course/:id/enroll)
export const enrollFreeCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return next(new HandleError("Course not found", 404));
    }

    if (!course.isActive) {
      return next(new HandleError("This course is inactive and cannot accept new enrollments.", 404));
    }

    if (course.isPaid && course.price > 0) {
      return next(
        new HandleError(
          "This is a premium paid course. Please complete payment to enroll.",
          400
        )
      );
    }

    // Check existing enrollment
    let enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (enrollment) {
      return res.status(200).json({
        success: true,
        message: "You are already enrolled in this course",
        enrollment,
      });
    }

    enrollment = await Enrollment.create({
      user: userId,
      course: courseId,
      status: "active",
      enrolledAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in free course",
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

// Get My Enrolled Courses (GET /api/v1/my-courses)
export const getMyCourses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const enrollments = await Enrollment.find({ user: userId, status: "active" })
      .populate("course")
      .sort({ enrolledAt: -1 });

    const myCourses = enrollments
      .filter((e) => e.course != null)
      .map((enrollment) => ({
        enrollmentId: enrollment._id,
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status,
        completedLessons: enrollment.completedLessons || [],
        lastWatchedLesson: enrollment.lastWatchedLesson || 0,
        course: enrollment.course,
      }));

    res.status(200).json({
      success: true,
      count: myCourses.length,
      courses: myCourses,
    });
  } catch (error) {
    next(error);
  }
};

// Update lesson progress (POST /api/v1/course/:id/progress)
export const updateLessonProgress = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;
    const { lessonIndex, completed } = req.body;

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId, status: "active" });
    if (!enrollment) {
      return next(new HandleError("Active enrollment not found for this course", 403));
    }

    enrollment.lastWatchedLesson = Number(lessonIndex) || 0;
    if (completed && !enrollment.completedLessons.includes(Number(lessonIndex))) {
      enrollment.completedLessons.push(Number(lessonIndex));
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      progress: {
        completedLessons: enrollment.completedLessons,
        lastWatchedLesson: enrollment.lastWatchedLesson,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify Protected Video Streaming Access (GET /api/v1/course/:id/video-access/:videoIndex)
export const checkVideoAccess = async (req, res, next) => {
  try {
    const { id, videoIndex } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return next(new HandleError("Course not found", 404));
    }

    if (!course.isActive && req.user?.role !== "admin") {
      return next(new HandleError("Course not found", 404));
    }

    const idx = parseInt(videoIndex, 10);
    const video = course.courseVideo[idx];

    if (!video) {
      return next(new HandleError("Lesson video not found", 404));
    }

    // Free and Trial videos can be watched freely
    if (video.accessType === "free" || video.accessType === "trial") {
      return res.status(200).json({
        success: true,
        allowed: true,
        accessType: video.accessType,
        video: {
          title: video.title,
          url: video.url,
          duration: video.duration,
          accessType: video.accessType,
        },
      });
    }

    // Subscription videos REQUIRE authenticated active enrollment!
    if (!req.user) {
      return res.status(403).json({
        success: false,
        allowed: false,
        isLocked: true,
        message: "This lesson requires subscription access. Please log in and enroll to unlock.",
      });
    }

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
      status: "active",
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        allowed: false,
        isLocked: true,
        message: "This lesson is locked. Please purchase or enroll in this course to continue.",
      });
    }

    return res.status(200).json({
      success: true,
      allowed: true,
      accessType: "subscription",
      video: {
        title: video.title,
        url: video.url,
        duration: video.duration,
        accessType: video.accessType,
      },
    });
  } catch (error) {
    next(error);
  }
};
