// import HandleError from "./handleError.js";
// import jwt from "jsonwebtoken";
// import User from "../model/userModel.js";

// export const verifyUser = async (req, res, next) => {
//   try {
//     let token = req.cookies?.token;

//     // Also support Bearer authorization header
//     if (!token && req.headers?.authorization && req.headers.authorization.startsWith("Bearer ")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return next(new HandleError("Access denied. Please login to continue.", 401));
//     }

//     const decodedData = jwt.verify(
//       token,
//       process.env.JWT_SECRET_KEY || "jwt@class_stream_secret_key_1607@"
//     );

//     const user = await User.findById(decodedData.id);
//     if (!user) {
//       return next(new HandleError("User belonging to this token no longer exists.", 401));
//     }
//     if (user.isActive === false) {
//       return next(new HandleError("This account is inactive.", 403));
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return next(new HandleError("Invalid or expired session. Please login again.", 401));
//   }
// };

// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return next(
//         new HandleError(
//           `Role (${req.user ? req.user.role : "Guest"}) is not authorized to access this resource`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };

// export const optionalAuth = async (req, res, next) => {
//   try {
//     let token = req.cookies?.token;
//     if (!token && req.headers?.authorization && req.headers.authorization.startsWith("Bearer ")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (token) {
//       const decodedData = jwt.verify(
//         token,
//         process.env.JWT_SECRET_KEY || "jwt@class_stream_secret_key_1607@"
//       );
//       const user = await User.findById(decodedData.id);
//       if (user) {
//         if (user.isActive === false) {
//           return next(new HandleError("This account is inactive.", 403));
//         }
//         req.user = user;
//       }
//     }
//   } catch (err) {
//     // Ignore invalid token in optional auth
//   }
//   next();
// };


import HandleError from "./handleError.js";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const verifyUser = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Also support Bearer authorization header
    if (!token && req.headers?.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new HandleError("Access denied. Please login to continue.", 401));
    }

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "jwt@class_stream_secret_key_1607@"
    );

    const user = await User.findById(decodedData.id);
    if (!user) {
      return next(new HandleError("User belonging to this token no longer exists.", 401));
    }
    if (user.deletionRequestStatus === "pending") {
      return next(
        new HandleError(
          "Your account deletion request is pending admin approval.",
          403,
          "DELETION_PENDING"
        )
      );
    }
    if (user.isActive === false) {
      return next(new HandleError("This account is inactive.", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new HandleError("Invalid or expired session. Please login again.", 401));
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new HandleError(
          `Role (${req.user ? req.user.role : "Guest"}) is not authorized to access this resource`,
          403
        )
      );
    }
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers?.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decodedData = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || "jwt@class_stream_secret_key_1607@"
      );
      const user = await User.findById(decodedData.id);
      if (user) {
        if (user.isActive === false) {
          return next(new HandleError("This account is inactive.", 403));
        }
        // A user with a pending deletion request is treated like a guest.
        if (user.deletionRequestStatus !== "pending") {
          req.user = user;
        }
      }
    }
  } catch (err) {
    // Ignore invalid token in optional auth
  }
  next();
};
