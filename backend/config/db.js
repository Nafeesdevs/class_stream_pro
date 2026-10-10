import mongoose from "mongoose";
import User from "../model/userModel.js";
import Category from "../model/categoryModel.js";
import Class from "../model/classModel.js";
import Course from "../model/courseModel.js";

// Sample educational video stream URLs (reliable public web mp4s for streaming demo)
// const SAMPLE_VIDEOS = [
//   {
//     title: "01. Introduction to Full Stack Modern Web Architecture",
//     url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//     duration: "10:15",
//     accessType: "free",
//     description: "Welcome to the course! In this lesson, we explore foundational concepts and the roadmap.",
//   },
//   {
//     title: "02. Core Fundamentals, Tools & Environment Setup",
//     url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
//     duration: "14:20",
//     accessType: "trial",
//     description: "Hands-on preview of setting up modern tooling, package managers, and editors.",
//   },
//   {
//     title: "03. Advanced Deep Dive, State Management & Production Best Practices",
//     url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
//     duration: "24:45",
//     accessType: "subscription",
//     description: "Exclusive deep dive into enterprise state orchestration and performance tuning.",
//   },
//   {
//     title: "04. Real-time Event Streaming & Cloud Deployment Pipeline",
//     url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
//     duration: "18:30",
//     accessType: "subscription",
//     description: "Production CI/CD deployment strategies and containerized distribution.",
//   },
// ];

let mongoMemoryServer;

export const seedInitialData = async () => {
  try {
    // 1. Seed Admin & Demo Student
    const adminExists = await User.findOne({ email: "admin@classstream.com" });
    if (!adminExists) {
      await User.create({
        name: "Admin Officer",
        email: "admin@classstream.com",
        password: "admin12345",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      });
      console.log("Seeded Admin User: admin@classstream.com / admin12345");
    }

    const studentExists = await User.findOne({ email: "student@classstream.com" });
    if (!studentExists) {
      await User.create({
        name: "Alex Morgan",
        email: "student@classstream.com",
        password: "student12345",
        role: "user",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
      });
      console.log("Seeded Student User: student@classstream.com / student12345");
    }

    // 2. Seed Categories
    // const initialCategories = [
    //   {
    //     categoryName: "Computer Science",
    //     categoryImage: [
    //       {
    //         imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    //         public_id: "seed_cs",
    //       },
    //     ],
    //   },
    //   {
    //     categoryName: "Web Development",
    //     categoryImage: [
    //       {
    //         imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
    //         public_id: "seed_web",
    //       },
    //     ],
    //   },
    //   {
    //     categoryName: "Data Science & AI",
    //     categoryImage: [
    //       {
    //         imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80",
    //         public_id: "seed_ai",
    //       },
    //     ],
    //   },
    //   {
    //     categoryName: "UI/UX & Product Design",
    //     categoryImage: [
    //       {
    //         imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80",
    //         public_id: "seed_design",
    //       },
    //     ],
    //   },
    //   {
    //     categoryName: "Cloud & DevOps",
    //     categoryImage: [
    //       {
    //         imageUrl: "https://images.unsplash.com/-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=8",
    //         public_id: "seed_cloud",
    //       },
    //     ],
    //   },
    // ];

    // for (const cat of initialCategories) {
    //   const exists = await Category.findOne({ categoryName: cat.categoryName });
    //   if (!exists) {
    //     await Category.create(cat);
    //   }
    // }

    // 3. Seed Classes
    // const initialClasses = ["Beginner", "Intermediate", "Advanced", "Class 10", "Class 12", "Masterclass"];
    // for (const cls of initialClasses) {
    //   const exists = await Class.findOne({ className: cls });
    //   if (!exists) {
    //     await Class.create({ className: cls });
    //   }
    // }

    // 4. Seed Rich Courses
    // const courseCount = await Course.countDocuments();
    // if (courseCount === 0) {
    //   const sampleCourses = [
    //     {
    //       courseName: "Full-Stack Web Development & Microservices",
    //       courseDescription: "Master end-to-end full stack architecture from React to Node.js, Express, MongoDB, and enterprise cloud distribution. Includes real-world hands-on project implementations.",
    //       courseCategory: "Web Development",
    //       courseClass: "Masterclass",
    //       price: 1999,
    //       originalPrice: 4999,
    //       currency: "INR",
    //       isPaid: true,
    //       instructor: "Prof. Sarah Jenkins",
    //       instructorTitle: "Principal Software Architect & Lead Educator",
    //       level: "Intermediate",
    //       duration: "28h 15m",
    //       rating: 4.9,
    //       reviewsCount: 342,
    //       courseImage: [
    //         {
    //           public_id: "seed_course_1",
    //           url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    //         },
    //       ],
    //       courseVideo: [
    //         {
    //           public_id: "vid_1_1",
    //           url: SAMPLE_VIDEOS[0].url,
    //           title: "Module 1: Modern Web Application Ecosystem Overview",
    //           duration: "11:20",
    //           accessType: "free",
    //         },
    //         {
    //           public_id: "vid_1_2",
    //           url: SAMPLE_VIDEOS[1].url,
    //           title: "Module 2: Project Setup, Tooling & Component Design",
    //           duration: "16:45",
    //           accessType: "trial",
    //         },
    //         {
    //           public_id: "vid_1_3",
    //           url: SAMPLE_VIDEOS[2].url,
    //           title: "Module 3: Scalable Express Microservices & REST APIs",
    //           duration: "22:10",
    //           accessType: "subscription",
    //         },
    //         {
    //           public_id: "vid_1_4",
    //           url: SAMPLE_VIDEOS[3].url,
    //           title: "Module 4: Authentication, Razorpay Checkout & Production Hosting",
    //           duration: "25:30",
    //           accessType: "subscription",
    //         },
    //       ],
    //     },
    //     {
    //       courseName: "Applied Artificial Intelligence & Deep Learning",
    //       courseDescription: "Comprehensive training in modern neural networks, computer vision, natural language processing, and prompt engineering with practical deployment blueprints.",
    //       courseCategory: "Data Science & AI",
    //       courseClass: "Advanced",
    //       price: 2499,
    //       originalPrice: 5999,
    //       currency: "INR",
    //       isPaid: true,
    //       instructor: "Dr. Marcus Vance",
    //       instructorTitle: "Former Research Scientist & Machine Learning Lead",
    //       level: "Advanced",
    //       duration: "34h 00m",
    //       rating: 4.95,
    //       reviewsCount: 420,
    //       courseImage: [
    //         {
    //           public_id: "seed_course_2",
    //           url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80",
    //         },
    //       ],
    //       courseVideo: [
    //         {
    //           public_id: "vid_2_1",
    //           url: SAMPLE_VIDEOS[0].url,
    //           title: "01. Introduction to Neural Architectures & Math Foundations",
    //           duration: "14:15",
    //           accessType: "free",
    //         },
    //         {
    //           public_id: "vid_2_2",
    //           url: SAMPLE_VIDEOS[1].url,
    //           title: "02. Building and Training Your First Transformer Model",
    //           duration: "18:00",
    //           accessType: "trial",
    //         },
    //         {
    //           public_id: "vid_2_3",
    //           url: SAMPLE_VIDEOS[2].url,
    //           title: "03. High Performance Model Inference & Optimization",
    //           duration: "28:10",
    //           accessType: "subscription",
    //         },
    //       ],
    //     },
    //     {
    //       courseName: "Foundations of Computer Science & Algorithmic Thinking",
    //       courseDescription: "Demystify algorithms, computational complexity, Big-O analysis, memory structures, and problem-solving techniques essential for tech interviews.",
    //       courseCategory: "Computer Science",
    //       courseClass: "Beginner",
    //       price: 0,
    //       originalPrice: 1499,
    //       currency: "INR",
    //       isPaid: false,
    //       instructor: "Elena Rostova",
    //       instructorTitle: "Senior Algorithmic Engineer",
    //       level: "Beginner",
    //       duration: "12h 45m",
    //       rating: 4.85,
    //       reviewsCount: 512,
    //       courseImage: [
    //         {
    //           public_id: "seed_course_3",
    //           url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    //         },
    //       ],
    //       courseVideo: [
    //         {
    //           public_id: "vid_3_1",
    //           url: SAMPLE_VIDEOS[0].url,
    //           title: "Lesson 1: Introduction to Computational Logic",
    //           duration: "09:40",
    //           accessType: "free",
    //         },
    //         {
    //           public_id: "vid_3_2",
    //           url: SAMPLE_VIDEOS[1].url,
    //           title: "Lesson 2: Data Structures: Arrays, Linked Lists & Stacks",
    //           duration: "15:20",
    //           accessType: "free",
    //         },
    //         {
    //           public_id: "vid_3_3",
    //           url: SAMPLE_VIDEOS[2].url,
    //           title: "Lesson 3: Trees, Graphs & Dynamic Programming",
    //           duration: "20:10",
    //           accessType: "free",
    //         },
    //       ],
    //     },
    //     {
    //       courseName: "UI/UX Design Systems & High-Fidelity Prototyping",
    //       courseDescription: "Learn how modern tech unicorns construct design systems, accessible token libraries, motion principles, and user-centered design prototypes.",
    //       courseCategory: "UI/UX & Product Design",
    //       courseClass: "Intermediate",
    //       price: 1499,
    //       originalPrice: 3499,
    //       currency: "INR",
    //       isPaid: true,
    //       instructor: "David Sterling",
    //       instructorTitle: "Product Design Director",
    //       level: "Intermediate",
    //       duration: "16h 20m",
    //       rating: 4.88,
    //       reviewsCount: 289,
    //       courseImage: [
    //         {
    //           public_id: "seed_course_4",
    //           url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
    //         },
    //       ],
    //       courseVideo: [
    //         {
    //           public_id: "vid_4_1",
    //           url: SAMPLE_VIDEOS[0].url,
    //           title: "01. Anatomy of Modern Design Systems & Variables",
    //           duration: "12:10",
    //           accessType: "free",
    //         },
    //         {
    //           public_id: "vid_4_2",
    //           url: SAMPLE_VIDEOS[1].url,
    //           title: "02. Typography Pairing, Spacing Math & Grid Systems",
    //           duration: "17:40",
    //           accessType: "trial",
    //         },
    //         {
    //           public_id: "vid_4_3",
    //           url: SAMPLE_VIDEOS[2].url,
    //           title: "03. Interactive Component Prototyping and Motion",
    //           duration: "23:15",
    //           accessType: "subscription",
    //         },
    //       ],
    //     },
    //   ];

    //   await Course.insertMany(sampleCourses);
    //   console.log("Seeded default courses successfully!");
    // }
  } catch (err) {
    console.error("Seeding warning:", err.message);
  }
};

export const connectDB = async () => {
  const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/class_stream";

  try {
    const conn = await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 2000,
    });
    await mongoose.connection.db.admin().ping();
    console.log("MongoDB Connected with server:", conn.connection.host);
    await seedInitialData();
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn("MongoDB connection unavailable:", error.message);
    console.warn("Starting MongoMemoryServer fallback...");
    try {
      await mongoose.disconnect();
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(uri);
      await mongoose.connection.db.admin().ping();
      console.log("MongoDB In-Memory Connected at:", conn.connection.host);
      await seedInitialData();
    } catch (mmsErr) {
      console.error("Could not start MongoDB memory server:", mmsErr.message);
      throw mmsErr;
    }
  }
};
