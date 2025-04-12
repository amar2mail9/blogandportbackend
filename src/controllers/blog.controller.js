import slugify from "slugify";
import { blogModels } from "../models/blog.models.js";
import { v2 as cloudinary } from 'cloudinary';
import { categoryModel } from "../models/category.model.js";
import { UserModels } from "../models/user.models.js";

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

    const file = req.file;

    // Basic validation
    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ success: false, error: "Content is required" });
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
    if (file && file.path) {
      try {
        uploadResult = await cloudinary.uploader.upload(file.path, {
          public_id: `blog_thumbnails/${slugify(title, { lower: true })}`,
        });
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error:", uploadErr);
      }
    }
    let cate = await categoryModel.findOne({ categoryName: category })
    const author = await UserModels.findById(
      req.user.id
    )
    // Create new blog post
    const newBlog = new blogModels({
      title,
      content,
      thumbnail: uploadResult.secure_url || "https://img.freepik.com/free-photo/technology-communication-icons-symbols-concept_53876-120314.jpg",
      slug: slugify(title, { lower: true }),
      isPublished,
      status: !isPublished ? "public" : "private",
      category: {
        _id: cate?._id,
        categoryName: cate.categoryName || "Uncategorized"
      },
      metaKeyWord,
      metaDescription,
      tags,
      expert,
      author: {
        _id: author._id,
        email: author.email,
        username: author.username,
        fullname: author.fullname,
      }
    });
    await newBlog.save();
    // find category 
    const findCategory = await categoryModel.findOne({ categoryName: category })

    if (findCategory) {
      findCategory.blogs.push(newBlog._id)
      await findCategory.save()
    }
    // find author

    const findAuthor = await UserModels.findOne({ username: author.username })

    if (findAuthor) {
      findAuthor.blogs.push(newBlog.id)
      await findAuthor.save()

    }


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
