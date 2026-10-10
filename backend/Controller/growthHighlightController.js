import GrowthHighlight from "../model/growthHighlightModel.js";
import HandleError from "../helper/handleError.js";

const defaultStats = [
  { value: 14000, suffix: "+", label: "Active Enrolled Students", sub: "Global engineering cohort" },
  { value: 150, suffix: "+", label: "HD Masterclass Tracks", sub: "Zero-buffering video lessons" },
  { value: 25, suffix: "+", label: "Specialized Curriculums", sub: "Frontend, AI, Cloud & Systems" },
  { value: 98.6, suffix: "%", label: "Course Satisfaction", sub: "Verified post-completion rating" },
];

export const getGrowthHighlights = async (req, res, next) => {
  try {
    const highlights = await GrowthHighlight.findOne({ key: "homepage" });
    res.status(200).json({
      success: true,
      growthHighlights: highlights || { stats: defaultStats },
    });
  } catch (error) {
    next(error);
  }
};

export const updateGrowthHighlights = async (req, res, next) => {
  try {
    const { stats } = req.body;
    if (!Array.isArray(stats) || stats.length !== 4) {
      return next(new HandleError("Exactly four growth highlights are required.", 400));
    }

    for (const stat of stats) {
      if (
        typeof stat.value !== "number" ||
        !Number.isFinite(stat.value) ||
        stat.value < 0 ||
        typeof stat.label !== "string" ||
        !stat.label.trim()
      ) {
        return next(new HandleError("Each highlight needs a non-negative number and a label.", 400));
      }
    }

    const growthHighlights = await GrowthHighlight.findOneAndUpdate(
      { key: "homepage" },
      { $set: { stats } },
      { returnDocument: "after", upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, growthHighlights });
  } catch (error) {
    next(error);
  }
};