import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },


    isPublished: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ['public', "private"],
      default: "public"
    },


    author: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      username: String,
      email: String,
      fullname: String,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
      }
    ],
    featuredImage: [
      {
        type: String, // cloudinary
      },
    ],

  },
  { timestamps: true }
);

export const categoryModel = mongoose.model("Category", categorySchema);
