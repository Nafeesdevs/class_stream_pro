import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, min: 0 },
    suffix: { type: String, default: "", maxlength: 12 },
    label: { type: String, required: true, trim: true, maxlength: 80 },
    sub: { type: String, default: "", trim: true, maxlength: 120 },
  },
  { _id: false }
);

const growthHighlightSchema = new mongoose.Schema(
  {
    key: { type: String, default: "homepage", unique: true },
    stats: {
      type: [statSchema],
      required: true,
      validate: {
        validator: (stats) => stats.length === 4,
        message: "Exactly four growth highlights are required.",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("GrowthHighlight", growthHighlightSchema);