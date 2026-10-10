// export const sendToken = (user, statusCode, res) => {
//   const token = user.getJwtToken();

//   const expireDays = parseInt(process.env.EXPIRE_COOKIE || "7", 10);
//   const options = {
//     expires: new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     sameSite: "lax",
//     secure: process.env.NODE_ENV === "production",
//   };

//   const userData = {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     avatar: user.avatar,
//     createdAt: user.createdAt,
//   };

//   res.status(statusCode).cookie("token", token, options).json({
//     success: true,
//     user: userData,
//     token,
//   });
// };

export const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const expireDays = parseInt(process.env.EXPIRE_COOKIE || "7", 10);

  const options = {
    expires: new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user: userData,
    token,
  });
};