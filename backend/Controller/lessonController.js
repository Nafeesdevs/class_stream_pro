import fs from "node:fs";
import Lesson from "../model/lessonModel.js";
import Subscription from "../model/subscriptionModel.js";
import cloudinary from "../config/cloudinary.js";
import HandleError from "../helper/handleError.js";

const activeSubscription = async (userId) => {
  const now = new Date();
  await Subscription.updateMany(
    { user: userId, state: { $in: ["active", "upcoming"] }, endDate: { $lte: now } },
    { $set: { state: "expired" } }
  );
  await Subscription.updateMany(
    { user: userId, state: "upcoming", startDate: { $lte: now }, endDate: { $gt: now } },
    { $set: { state: "active" } }
  );
  return Subscription.findOne({
    user: userId,
    state: "active",
    startDate: { $lte: now },
    endDate: { $gt: now },
  }).sort({ endDate: -1 });
};

const uploadVideo = async (file) => {
  try {
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "class_stream/lessons",
      resource_type: "video",
    });
    fs.unlink(file.path, () => {});
    return { url: uploaded.secure_url, public_id: uploaded.public_id };
  } catch (error) {
    console.warn("Cloudinary video upload failed; storing locally:", error.message);
    return { url: `/upload/${file.filename}`, public_id: `local_${file.filename}` };
  }
};

const readVideoInput = async (req, existing = {}) => {
  const title = String(req.body.title || existing.title || "").trim();
  if (!title) throw new HandleError("Video title is required", 400);

  if (req.file) {
    const uploaded = await uploadVideo(req.file);
    return {
      ...existing,
      title,
      duration: String(req.body.duration || existing.duration || ""),
      accessType: req.body.accessType || existing.accessType || "subscription",
      ...uploaded,
    };
  }

  const url = String(req.body.videoUrl || req.body.url || existing.url || "").trim();
  if (!url) throw new HandleError("A video file or URL is required", 400);
  return {
    ...existing,
    title,
    url,
    duration: String(req.body.duration || existing.duration || ""),
    accessType: req.body.accessType || existing.accessType || "subscription",
  };
};

export const getLessons = async (req, res, next) => {
  try {
    const filter = req.user?.role === "admin" ? {} : { isActive: true };
    const lessons = await Lesson.find(filter).sort({ order: 1, createdAt: 1 });
    const subscription = req.user && req.user.role !== "admin"
      ? await activeSubscription(req.user._id)
      : null;
    const assigned = new Set((subscription?.assignedLessons || []).map(String));

    res.status(200).json({
      success: true,
      lessons: lessons.map((lesson) => {
        const isUnlocked = assigned.has(String(lesson._id));
        const data = lesson.toObject();
        data.isUnlocked = isUnlocked;
        if (req.user?.role !== "admin" && !isUnlocked) {
          data.videos = data.videos.map((video) =>
            video.accessType === "free" ? video : { ...video, url: "" }
          );
        }
        return data;
      }),
      subscription: subscription
        ? {
            ...subscription.toObject(),
            classesLeft: Math.max(0, subscription.classesAllowed - subscription.classesUsed),
            daysLeft: Math.max(0, Math.ceil((subscription.endDate.getTime() - Date.now()) / 86400000)),
            status: subscription.state,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, lessons, count: lessons.length });
  } catch (error) {
    next(error);
  }
};

export const createLesson = async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    if (!title) return next(new HandleError("Class title is required", 400));
    const count = await Lesson.countDocuments();
    const lesson = await Lesson.create({
      title,
      description: req.body.description || "",
      duration: req.body.duration || "",
      order: req.body.order === undefined ? count + 1 : Number(req.body.order),
      isActive: req.body.isActive !== false && req.body.isActive !== "false",
    });
    res.status(201).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

export const updateLesson = async (req, res, next) => {
  try {
    const updates = {};
    for (const key of ["title", "description", "duration"]) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (req.body.order !== undefined) updates.order = Number(req.body.order);
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive === true || req.body.isActive === "true";
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!lesson) return next(new HandleError("Class not found", 404));
    res.status(200).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return next(new HandleError("Class not found", 404));
    await Subscription.updateMany({}, { $pull: { assignedLessons: lesson._id } });
    res.status(200).json({ success: true, message: "Class deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const addLessonVideo = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return next(new HandleError("Class not found", 404));
    lesson.videos.push(await readVideoInput(req));
    await lesson.save();
    res.status(201).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

export const updateLessonVideo = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    const video = lesson?.videos.id(req.params.videoId);
    if (!video) return next(new HandleError("Video not found", 404));
    Object.assign(video, await readVideoInput(req, video.toObject()));
    await lesson.save();
    res.status(200).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

export const deleteLessonVideo = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return next(new HandleError("Class not found", 404));
    const video = lesson.videos.id(req.params.videoId);
    if (!video) return next(new HandleError("Video not found", 404));
    video.deleteOne();
    await lesson.save();
    res.status(200).json({ success: true, lesson });
  } catch (error) {
    next(error);
  }
};

export const accessLessonVideo = async (req, res, next) => {
  try {
    const lesson = await Lesson.findOne({ _id: req.params.id, isActive: true });
    if (!lesson) return next(new HandleError("Class not found", 404));
    const video = lesson.videos.id(req.params.videoId);
    if (!video) return next(new HandleError("Video not found", 404));
    if (video.accessType === "free") {
      return res.status(200).json({ success: true, video });
    }
    if (!req.user || req.user.role === "admin") {
      return next(new HandleError("An active student subscription is required.", 403, "NO_SUBSCRIPTION"));
    }

    let subscription = await activeSubscription(req.user._id);
    if (!subscription) {
      return next(new HandleError("An active subscription is required to unlock this class.", 403, "NO_SUBSCRIPTION"));
    }

    const alreadyAssigned = subscription.assignedLessons.some((id) => String(id) === String(lesson._id));
    if (!alreadyAssigned) {
      subscription = await Subscription.findOneAndUpdate(
        {
          _id: subscription._id,
          classesUsed: { $lt: subscription.classesAllowed },
          assignedLessons: { $ne: lesson._id },
        },
        { $addToSet: { assignedLessons: lesson._id }, $inc: { classesUsed: 1 } },
        { new: true }
      );
      if (!subscription) {
        subscription = await activeSubscription(req.user._id);
        if (!subscription?.assignedLessons.some((id) => String(id) === String(lesson._id))) {
          return next(new HandleError("You have used all classes included in your plan.", 403, "LIMIT_REACHED"));
        }
      }
    }

    res.status(200).json({
      success: true,
      video,
      newlyUnlocked: !alreadyAssigned,
      subscription: {
        ...subscription.toObject(),
        classesLeft: Math.max(0, subscription.classesAllowed - subscription.classesUsed),
        daysLeft: Math.max(0, Math.ceil((subscription.endDate.getTime() - Date.now()) / 86400000)),
        status: subscription.state,
      },
    });
  } catch (error) {
    next(error);
  }
};