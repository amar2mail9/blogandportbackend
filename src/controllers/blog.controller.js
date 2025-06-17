import slugify from "slugify";
import { blogModels } from "../models/blog.models.js";
import { v2 as cloudinary } from "cloudinary";
import { categoryModel } from "../models/category.model.js";
import { UserModels } from "../models/user.models.js";

// create blog
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      isPublished,
      metaKeyWord,
      metaDescription,
      tags,
      expert,
    } = req.body;
    console.log(category);

    const file = req.file;

    // Basic validation
    if (!title) {
      return res
        .status(400)
        .json({ success: false, error: "Title is required" });
    }

    if (!content) {
      return res
        .status(400)
        .json({ success: false, error: "Content is required" });
    }

    // Check if blog already exists
    const isBlog = await blogModels.findOne({ title });
    if (isBlog) {
      return res.status(400).json({
        success: false,
        error: `${title} already exists`,
      });
    }

    // Upload image to Cloudinary
    let uploadResult = { secure_url: "" };
    if (file?.path) {
      try {
        uploadResult = await cloudinary.uploader.upload(file.path, {
          public_id: `blog_thumbnails/${slugify(title, { lower: true })}`,
        });
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error:", uploadErr);
      }
    }

    //
    const findCategory = await categoryModel.findOne({
      slug: category,
    });

    console.log(findCategory);

    const author = await UserModels.findById(req.user.id);
    if (!author) {
      return res
        .status(404)
        .json({ success: false, error: "Author not found" });
    }

    // Create new blog post
    const newBlog = new blogModels({
      title,
      content,
      thumbnail:
        uploadResult.secure_url ||
        "https://img.freepik.com/free-photo/technology-communication-icons-symbols-concept_53876-120314.jpg",
      slug: slugify(title, { lower: true }),
      isPublished,
      status: isPublished ? "public" : "private",
      category: {
        _id: findCategory?._id || null,
        categoryName: findCategory.categoryName || "Uncategorized",
      },
      metaKeyWord,
      metaDescription,
      tags,
      expert: expert || "No Expert",
      author: {
        _id: author._id,
        email: author.email,
        username: author.username,
        fullname: author.fullname,
      },
    });

    await newBlog.save();

    if (findCategory) {
      findCategory.blogs.push(newBlog._id);
      await findCategory.save();
      console.log(findCategory);
    }

    // Push blog to author's list
    author.blogs.push(newBlog._id);
    await author.save();

    return res.status(201).json({
      success: true,
      blog: newBlog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while creating the blog.",
    });
  }
};

// get public blogs

export const getPublicBlog = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = parseInt(req.query.skip) || 0;

    const blogs = await blogModels
      .find({ isPublished: true })
      .populate("author", "fullname email username")
      .populate("category", "categoryName")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while creating the blog.",
    });
  }
};

// get all blogs
export const allBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = parseInt(req.query.skip) || 0; // Default skip for pagination

    const blogs = await blogModels
      .find()
      .populate("author", "fullname email username")
      .populate("category", "categoryName")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// category wise blog get

export const categoryWiseBlog = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    const categoryName = req.params.category;

    const blogs = await blogModels
      .find({ "category.slug": categoryName })
      .populate("author", "fullname email username")
      .populate("category", "categoryName", "slug")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get single blog

export const detailsBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(slug);

    const blog = await blogModels.findOne({ slug });
    console.log(blog);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// delete single blog

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogModels.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
