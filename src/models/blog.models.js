import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    thumbnail:
    {
      type: String,
      required: true,
    },


    author: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      email: String,
      username: String,
      fullname: String
    },
    expert: {
      type: String,
    },

    tags: [
      {
        type: String,
      },
    ],
    metaDescription: {
      type: String,
    },
    metaKeyWord: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    category: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
      categoryName: String
    },
    status: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    }
  },
  { timestamps: true }
);

export const blogModels = mongoose.model("Blog", blogSchema);
