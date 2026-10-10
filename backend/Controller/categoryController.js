import HandleError from "../helper/handleError.js";
import Category from "../model/categoryModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// Helper to safely upload to Cloudinary with local fallback
const uploadFileSafely = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "class_stream/categories",
    });
    // Remove temporary local file
    try {
      fs.unlinkSync(file.path);
    } catch (e) {}
    return {
      imageUrl: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.warn("Cloudinary upload failed, using local/data URL fallback:", error.message);
    // In case Cloudinary is unreachable or has bad credentials, provide reliable fallback
    const fallbackUrl = `/upload/${file.filename}`;
    return {
      imageUrl: fallbackUrl,
      public_id: `local_${Date.now()}_${file.filename}`,
    };
  }
};

export const createcategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName || categoryName.trim() === "") {
      return next(new HandleError("Category name is required", 400));
    }

    const existing = await Category.findOne({
      categoryName: { $regex: new RegExp(`^${categoryName.trim()}$`, "i") },
    });
    if (existing) {
      return next(new HandleError("A category with this name already exists", 400));
    }

    const categoryImage = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const img = await uploadFileSafely(file);
        categoryImage.push(img);
      }
    } else if (req.file) {
      const img = await uploadFileSafely(req.file);
      categoryImage.push(img);
    } else {
      // Default placeholder if none provided
      categoryImage.push({
        imageUrl:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
        public_id: "default_category",
      });
    }

    const category = await Category.create({
      categoryName: categoryName.trim(),
      categoryImage,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      category,
      count: category.length,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    let category = await Category.findById(id);

    if (!category) {
      return next(new HandleError("Category not found", 404));
    }

    const updateData = {};
    if (req.body.categoryName) {
      updateData.categoryName = req.body.categoryName.trim();
    }

    // Check if new image was uploaded to replace old image
    if ((req.files && req.files.length > 0) || req.file) {
      const files = req.files || [req.file];
      const newImages = [];

      for (const file of files) {
        if (file) {
          const img = await uploadFileSafely(file);
          newImages.push(img);
        }
      }

      if (newImages.length > 0) {
        // Attempt to clean up old Cloudinary images
        for (const oldImg of category.categoryImage) {
          if (oldImg.public_id && !oldImg.public_id.startsWith("local_") && oldImg.public_id !== "default_category") {
            try {
              await cloudinary.uploader.destroy(oldImg.public_id);
            } catch (e) {
              console.warn("Could not delete old cloudinary image:", e.message);
            }
          }
        }
        updateData.categoryImage = newImages;
      }
    }

    category = await Category.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);

    if (!category) {
      return next(new HandleError("Category not found", 404));
    }

    // Delete associated Cloudinary images
    for (const img of category.categoryImage) {
      if (img.public_id && !img.public_id.startsWith("local_") && img.public_id !== "default_category") {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (e) {
          console.warn("Failed to delete category image from cloudinary:", e.message);
        }
      }
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
