import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
    planName: { type: String, required: true },
    planSnapshot: {
      name: { type: String, required: true },
      durationMonths: { type: Number, required: true },
      classLimit: { type: Number, required: true },
    },
    pricePaid: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    classesAllowed: { type: Number, required: true },
    classesUsed: { type: Number, default: 0 },
    assignedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    state: { type: String, enum: ["active", "upcoming", "expired", "cancelled"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

subscriptionSchema.index({ user: 1, state: 1, startDate: 1 });
subscriptionSchema.index({ payment: 1 }, { unique: true });

export default mongoose.model("Subscription", subscriptionSchema);