import express from "express";
import { createBlog } from "../controllers/blog.controller.js";
import { upload } from "../config/multerFileUoloader.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

export const blogRoute = express.Router();

// "featuredImage" should match the name in your frontend form
blogRoute.post('/blog/new', upload.single("thumbnail"), verifyToken, createBlog);
