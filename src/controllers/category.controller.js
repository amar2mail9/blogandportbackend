import slugify from "slugify";
import { categoryModel } from "../models/category.model.js";
import { UserModels } from "../models/user.models.js";
import { v2 as cloudinary } from "cloudinary";

// create category
export const createCategory = async (req, res) => {
  try {
    const { categoryName, description, slug, isPublished } = req.body;
const file  = req.file


    if (!categoryName) {
      return res.status(400).json({
        success: false,
        error: "Category name is required",
      });
    }
if (file && file.path) {
  uploadResult = await cloudinary.uploader.upload(file.path, {
    public_id: `blog_thumbnails/${slugify(categoryName, { lower: true })}`,
  });
  console.log(uploadResult);
  
}
    const isCategory = await categoryModel.findOne({ categoryName });

    if (isCategory) {
      return res.status(409).json({
        success: false,
        error: "Category name already exists",
      });
    }

    const author = await UserModels.findById(req.user.id);

    const newCategory = new categoryModel({
      categoryName,
      slug: slug || categoryName.toLowerCase().replace(/\s+/g, "-"),
      description: description || "No Description",
      isPublished,
      status: isPublished ? "public" : "private",
      author: {
        _id: author._id,
        email: author.email,
        username: author.username,
        fullname: author.fullname,
      }
    });

    await newCategory.save();
    // Push category ID to user's categories array
    await UserModels.findByIdAndUpdate(
      req.user.id,
      { $push: { categories: newCategory._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,

    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// get Public category
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({ isPublished: true });
    if (categories.length === 0) {
      return res.status(409).json({
        success: false,
        error: "No Category Available",
      });
    }

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,

    });




  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// get all category 

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    if (categories.length === 0) {
      return res.status(409).json({
        success: false,
        error: "No Category Available",
      });
    }

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,

    });




  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};


// get singe category

export const previewCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: "Slug is required",
      });
    }



    const category = await categoryModel.findOne(slug);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      category,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

// Delete category

export const DeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Slug is required",
      });
    }



    const category = await categoryModel.deleteOne({ _id: id });



    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
      category,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};


export const EditCategory = async (req, res) => {
  try {
    const id = req.params?.id.trim();
    const { slug, categoryName, description, isPublished } = req.body

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Category ID is required",
      });
    }

    // chat Gpt code
    const category = await categoryModel.findByIdAndUpdate(
      { _id: id },
      (() => {
        const update = {};

        if (categoryName) {
          update.categoryName = categoryName;
          update.slug = categoryName.toLowerCase().replace(/\s+/g, "-"); // auto-generate slug
        }

        if (typeof isPublished === "boolean") {
          update.isPublished = isPublished;
          update.status = isPublished ? "public" : "private"; // auto-set status
        }

        if (description) {
          update.description = description;
        }

        return update;
      })(),
      { new: true }
    );




    return res.status(200).json({
      success: true,
      message: "Changed successfully",
      category,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};
