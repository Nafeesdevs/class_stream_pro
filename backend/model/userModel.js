// import mongoose from "mongoose";
// import validator from "validator";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please enter your name"],
//       maxLength: [50, "Invalid name. Please enter a name with fewer than 50 characters"],
//       minLength: [2, "Name should contain more than 2 characters"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Please enter your email"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       validate: [validator.isEmail, "Please enter a valid email address"],
//     },
//     password: {
//       type: String,
//       required: [true, "Please enter your password"],
//       minLength: [6, "Password should be at least 6 characters"],
//       select: false,
//     },
//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     avatar: {
//       type: String,
//       default: "",
//     },

    
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) {
//     return;
//   }
//   this.password = await bcryptjs.hash(this.password, 10);
// });

// userSchema.methods.getJwtToken = function () {
//   return jwt.sign(
//     { id: this._id },
//     process.env.JWT_SECRET_KEY || "jwt@class_stream_secret_key_1607@",
//     {
//       expiresIn: process.env.JWT_EXPIRE || "7d",
//     }
//   );
// };

// userSchema.methods.verifyPassword = async function (userPassword) {
//   return await bcryptjs.compare(userPassword, this.password);
// };

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [50, "Invalid name. Please enter a name with fewer than 50 characters"],
      minLength: [2, "Name should contain more than 2 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Password should be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: "",
    },

    // "pending" while the user's account-deletion request waits for an admin.
    // A pending user cannot sign in and any existing session is rejected.
    deletionRequestStatus: {
      type: String,
      enum: ["none", "pending"],
      default: "none",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY || "jwt@class_stream_secret_key_1607@",
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
};

userSchema.methods.verifyPassword = async function (userPassword) {
  return await bcryptjs.compare(userPassword, this.password);
};

export default mongoose.model("User", userSchema);
