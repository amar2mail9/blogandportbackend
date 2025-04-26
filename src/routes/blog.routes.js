import express from "express";
import { allBlogs,  categoryWiseBlog,  createBlog, deleteBlog, detailsBlog, getPublicBlog } from "../controllers/blog.controller.js";
import { upload } from "../config/multerFileUoloader.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

export const blogRoute = express.Router();

// "featuredImage" should match the name in your frontend form
blogRoute.post('/blog/new', upload.single("thumbnail"), verifyToken, createBlog);
blogRoute.get('/blogs', getPublicBlog);

blogRoute.get('/blog/all',verifyToken,allBlogs)
blogRoute.get('/blogs/:category',verifyToken,categoryWiseBlog)
blogRoute.get('/blog/:slug',detailsBlog)
blogRoute.delete('/blog/:id',deleteBlog)
