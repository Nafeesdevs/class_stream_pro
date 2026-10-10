import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true },
  duration: { type: String, default: "" },
  accessType: { type: String, enum: ["free", "subscription"], default: "subscription" },
  public_id: { type: String, default: "" },
});

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    duration: { type: String, default: "" },
    order: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    videos: [videoSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);