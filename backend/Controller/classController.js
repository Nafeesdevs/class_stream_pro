import Class from "../model/classModel.js";
import HandleError from "../helper/handleError.js";

export const createClass = async (req, res, next) => {
  try {
    const { className } = req.body;
    if (!className || className.trim() === "") {
      return next(new HandleError("Class name is required", 400));
    }

    const existing = await Class.findOne({
      className: { $regex: new RegExp(`^${className.trim()}$`, "i") },
    });
    if (existing) {
      return next(new HandleError("A class with this name already exists", 400));
    }

    const classs = await Class.create({ className: className.trim() });
    res.status(201).json({
      success: true,
      class: classs,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllClass = async (req, res, next) => {
  try {
    const classs = await Class.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      classes: classs,
      count: classs.length,
    });
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { className } = req.body;

    if (!className || className.trim() === "") {
      return next(new HandleError("Class name cannot be empty", 400));
    }

    const classs = await Class.findByIdAndUpdate(
      id,
      { className: className.trim() },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!classs) {
      return next(new HandleError("Class not found", 404));
    }

    res.status(200).json({
      success: true,
      class: classs,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const id = req.params.id;
    const classs = await Class.findByIdAndDelete(id);

    if (!classs) {
      return next(new HandleError("Class not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
