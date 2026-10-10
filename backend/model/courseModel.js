import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Please enter course name"],
      trim: true,
    },
    courseDescription: {
      type: String,
      required: [true, "Please enter course description"],
    },
    courseCategory: {
      type: String,
      required: [true, "Please select course category"],
    },
    courseClass: {
      type: String,
      required: [true, "Please select course class"],
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    instructor: {
      type: String,
      default: "Prof. Sarah Jenkins",
    },
    instructorTitle: {
      type: String,
      default: "Senior Curriculum Specialist & Principal Educator",
    },
    level: {
      type: String,
      default: "All Levels",
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
    },
    duration: {
      type: String,
      default: "8h 45m",
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 128,
    },
    courseImage: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    courseVideo: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          default: "12:30",
        },
        description: {
          type: String,
          default: "",
        },
        accessType: {
          type: String,
          enum: ["trial", "free", "subscription"],
          default: "free",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", courseSchema);
