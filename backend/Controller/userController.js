// import User from "../model/userModel.js";
// import Enrollment from "../model/enrollmentModel.js";
// import HandleError from "../helper/handleError.js";
// import { sendToken } from "../helper/jwtToken.js";

// // Register User
// export const registerUser = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || name.trim() === "") {
//       return next(new HandleError("Name cannot be empty", 400));
//     }
//     if (!email || email.trim() === "") {
//       return next(new HandleError("Email cannot be empty", 400));
//     }
//     if (!password || password.length < 6) {
//       return next(new HandleError("Password must be at least 6 characters long", 400));
//     }

//     const existingUser = await User.findOne({ email: email.toLowerCase() });
//     if (existingUser) {
//       return next(new HandleError("An account with this email already exists", 400));
//     }

//     const user = await User.create({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       password,
//       role: "user",
//     });

//     sendToken(user, 201, res);
//   } catch (error) {
//     next(error);
//   }
// };

// // Login User
// export const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return next(new HandleError("Email and Password are required", 400));
//     }

//     // Safely find user with password
//     const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

//     // Critical bugfix: if user does not exist, do not call user.verifyPassword!
//     if (!user) {
//       return next(new HandleError("Invalid Email or Password", 401));
//     }

//     const isValidPassword = await user.verifyPassword(password);
//     if (!isValidPassword) {
//       return next(new HandleError("Invalid Email or Password", 401));
//     }
//     if (user.isActive === false) {
//       return next(new HandleError("This account is inactive.", 403));
//     }

//     sendToken(user, 200, res);
//   } catch (error) {
//     next(error);
//   }
// };

// // Logout User
// export const logoutUser = async (req, res, next) => {
//   try {
//     res.cookie("token", null, {
//       expires: new Date(Date.now()),
//       httpOnly: true,
//       sameSite: "lax",
//       secure: process.env.NODE_ENV === "production",
//     });

//     res.status(200).json({
//       success: true,
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get Currently Authenticated User (GET /api/v1/me)
// export const getCurrentUser = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return next(new HandleError("User not found", 404));
//     }

//     // Count active enrollments
//     const enrollmentsCount = await Enrollment.countDocuments({
//       user: user._id,
//       status: "active",
//     });
//     const enrollments = await Enrollment.find({ user: user._id, status: "active" })
//       .select("course completedLessons lastWatchedLesson enrolledAt status")
//       .populate("course", "_id courseName");

//     res.status(200).json({
//       success: true,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar,
//         createdAt: user.createdAt,
//         enrollmentsCount,
//         enrolledCourses: enrollments,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Update Own Profile
// export const updateProfile = async (req, res, next) => {
//   try {
//     const { name, avatar } = req.body;
//     const updateData = {};
//     if (name) updateData.name = name.trim();
//     if (avatar !== undefined) updateData.avatar = avatar;

//     const user = await User.findByIdAndUpdate(req.user.id, updateData, {
//       returnDocument: "after",
//       runValidators: true,
//     });

//     res.status(200).json({
//       success: true,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get All Users (Admin)
// export const getAllUser = async (req, res, next) => {
//   try {
//     const users = await User.find().sort({ createdAt: -1 });
//     const usersWithEnrollments = await Promise.all(
//       users.map(async (user) => {
//         const enrollments = await Enrollment.find({ user: user._id, status: "active" })
//           .select("course completedLessons lastWatchedLesson enrolledAt status")
//           .populate("course", "_id courseName");
//         return { ...user.toObject(), enrolledCourses: enrollments };
//       })
//     );
//     res.status(200).json({
//       success: true,
//       users: usersWithEnrollments,
//       count: usersWithEnrollments.length,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const createAdminManagedUser = async (req, res, next) => {
//   try {
//     const { name, email, password, role = "user" } = req.body;
//     if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
//       return next(new HandleError("Name, email, and a password of at least six characters are required", 400));
//     }
//     if (!['user', 'admin'].includes(role)) {
//       return next(new HandleError("Invalid user role", 400));
//     }

//     const normalizedEmail = email.trim().toLowerCase();
//     const existingUser = await User.findOne({ email: normalizedEmail });
//     if (existingUser) {
//       return next(new HandleError("An account with this email already exists", 409));
//     }

//     const user = await User.create({
//       name: name.trim(),
//       email: normalizedEmail,
//       password,
//       role,
//     });

//     res.status(201).json({
//       success: true,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         createdAt: user.createdAt,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Get User by ID (Admin or Self)
// export const getUserById = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const user = await User.findById(id);
//     if (!user) {
//       return next(new HandleError("User not found", 404));
//     }
//     res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Update User (Admin)
// export const updateUser = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const { name, role, isActive } = req.body;

//     const updateData = {};
//     if (name) updateData.name = name;
//     if (role) updateData.role = role;
//     if (isActive !== undefined) updateData.isActive = isActive === "true" || isActive === true;

//     const user = await User.findByIdAndUpdate(id, updateData, {
//       returnDocument: "after",
//       runValidators: true,
//     });

//     if (!user) {
//       return next(new HandleError("User not found", 404));
//     }

//     res.status(200).json({
//       success: true,
//       user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // Delete User (Admin)
// export const deleteUser = async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     if (req.user.id === id) {
//       return next(new HandleError("You cannot delete your own admin account", 400));
//     }

//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return next(new HandleError("User not found", 404));
//     }

//     // Clean up user enrollments
//     await Enrollment.deleteMany({ user: id });

//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };


import User from "../model/userModel.js";
import Enrollment from "../model/enrollmentModel.js";
import DeletionRequest from "../model/deletionRequestModel.js";
import HandleError from "../helper/handleError.js";
import { sendToken } from "../helper/jwtToken.js";

// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim() === "") {
      return next(new HandleError("Name cannot be empty", 400));
    }
    if (!email || email.trim() === "") {
      return next(new HandleError("Email cannot be empty", 400));
    }
    if (!password || password.length < 6) {
      return next(new HandleError("Password must be at least 6 characters long", 400));
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new HandleError("An account with this email already exists", 400));
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: "user",
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// Login User
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HandleError("Email and Password are required", 400));
    }

    // Safely find user with password
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    // Critical bugfix: if user does not exist, do not call user.verifyPassword!
    if (!user) {
      return next(new HandleError("Invalid Email or Password", 401));
    }

    const isValidPassword = await user.verifyPassword(password);
    if (!isValidPassword) {
      return next(new HandleError("Invalid Email or Password", 401));
    }
    // Only revealed AFTER the password is correct, so nobody can probe which
    // emails have a pending deletion request.
    if (user.deletionRequestStatus === "pending") {
      return next(
        new HandleError(
          "Your account deletion request is pending admin approval. You cannot sign in until the admin reviews it.",
          403,
          "DELETION_PENDING"
        )
      );
    }
    if (user.isActive === false) {
      return next(new HandleError("This account is inactive.", 403));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Logout User
export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get Currently Authenticated User (GET /api/v1/me)
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HandleError("User not found", 404));
    }

    // Count active enrollments
    const enrollmentsCount = await Enrollment.countDocuments({
      user: user._id,
      status: "active",
    });
    const enrollments = await Enrollment.find({ user: user._id, status: "active" })
      .select("course completedLessons lastWatchedLesson enrolledAt status")
      .populate("course", "_id courseName");

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        enrollmentsCount,
        enrolledCourses: enrollments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Own Profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get All Users (Admin)
export const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const usersWithEnrollments = await Promise.all(
      users.map(async (user) => {
        const enrollments = await Enrollment.find({ user: user._id, status: "active" })
          .select("course completedLessons lastWatchedLesson enrolledAt status")
          .populate("course", "_id courseName");
        return { ...user.toObject(), enrolledCourses: enrollments };
      })
    );
    res.status(200).json({
      success: true,
      users: usersWithEnrollments,
      count: usersWithEnrollments.length,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdminManagedUser = async (req, res, next) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return next(new HandleError("Name, email, and a password of at least six characters are required", 400));
    }
    if (!['user', 'admin'].includes(role)) {
      return next(new HandleError("Invalid user role", 400));
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return next(new HandleError("An account with this email already exists", 409));
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get User by ID (Admin or Self)
export const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return next(new HandleError("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update User (Admin)
export const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, role, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive === "true" || isActive === true;

    const user = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return next(new HandleError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Delete User (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (req.user.id === id) {
      return next(new HandleError("You cannot delete your own admin account", 400));
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return next(new HandleError("User not found", 404));
    }

    // Clean up user enrollments
    await Enrollment.deleteMany({ user: id });

    // If this user had a pending account-deletion request, close it so it
    // does not stay "pending" forever in the admin list.
    await DeletionRequest.updateMany(
      { user: id, status: "pending" },
      {
        status: "approved",
        reviewedBy: req.user._id,
        reviewedByName: req.user.name,
        reviewedAt: new Date(),
      }
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
