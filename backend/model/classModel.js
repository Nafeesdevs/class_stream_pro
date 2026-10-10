import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, "Please enter class name"],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
