import mongoose from "mongoose";

const deletionRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Snapshot of the user's details. The user document is removed when the
    // admin approves, so the request keeps its own copy for the history list.
    name: { type: String, required: true },
    email: { type: String, required: true },
    enrollmentsCount: { type: Number, default: 0 },

    reason: {
      type: String,
      required: [true, "Please tell us why you want to delete your account"],
      trim: true,
      minLength: [10, "Please describe your reason in at least 10 characters"],
      maxLength: [500, "Reason must be 500 characters or fewer"],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedByName: { type: String, default: "" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

// A user can only ever have ONE pending request at a time.
deletionRequestSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);

export default mongoose.model("DeletionRequest", deletionRequestSchema);
