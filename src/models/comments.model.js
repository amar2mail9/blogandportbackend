import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    fullname: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['private', "public"],
      default: "private"
    }
  },
  { timestamps: true }
);

export const commentsModels = mongoose.model("Comment", commentSchema);
