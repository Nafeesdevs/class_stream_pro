// import HandleError from "../helper/handleError.js";

// export default (err, req, res, next) => {
//   let error = { ...err };
//   error.message = err.message || "Internal Server Error";
//   error.statusCode = err.statusCode || 500;

//   // Wrong Mongoose Object ID Error (CastError)
//   if (err.name === "CastError") {
//     const message = `Resource not found. Invalid: ${err.path}`;
//     error = new HandleError(message, 404);
//   }

//   // Mongoose duplicate key error (code 11000)
//   if (err.code === 11000) {
//     const field = Object.keys(err.keyValue || {})[0] || "field";
//     const message = `This ${field} is already registered. Please choose another.`;
//     error = new HandleError(message, 400);
//   }

//   // Wrong JWT error
//   if (err.name === "JsonWebTokenError") {
//     const message = "JSON Web Token is invalid. Try again.";
//     error = new HandleError(message, 401);
//   }

//   // JWT EXPIRED error
//   if (err.name === "TokenExpiredError") {
//     const message = "JSON Web Token is expired. Try again.";
//     error = new HandleError(message, 401);
//   }

//   // Mongoose Validation Error
//   if (err.name === "ValidationError") {
//     const message = Object.values(err.errors).map((val) => val.message).join(", ");
//     error = new HandleError(message, 400);
//   }

//   res.status(error.statusCode).json({
//     success: false,
//     message: error.message,
//   });
// };


import HandleError from "../helper/handleError.js";

export default (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || "Internal Server Error";
  error.statusCode = err.statusCode || 500;

  // Wrong Mongoose Object ID Error (CastError)
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new HandleError(message, 404);
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const message = `This ${field} is already registered. Please choose another.`;
    error = new HandleError(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try again.";
    error = new HandleError(message, 401);
  }

  // JWT EXPIRED error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired. Try again.";
    error = new HandleError(message, 401);
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message).join(", ");
    error = new HandleError(message, 400);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.errorCode ? { errorCode: error.errorCode } : {}),
  });
};
