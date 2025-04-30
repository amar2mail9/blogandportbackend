import express from "express";
import {
  createCategory,
  DeleteCategory,
  EditCategory,
  getAllCategories,
  getCategories,
  previewCategory,
} from "../controllers/category.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multerFileUoloader.js";

export const categoryRouter = express.Router();

// create category
categoryRouter.post("/category/new",upload.single('image'), verifyToken, createCategory);

// get public category
categoryRouter.get("/categories", getCategories);

// get all category
categoryRouter.get("/categories/all", verifyToken, getAllCategories);
// details category
categoryRouter.get(`/category/:slug`, previewCategory);
// delete category
categoryRouter.delete(`/category/:id`, verifyToken, DeleteCategory);
// edit category 
categoryRouter.put(`/category/:id`, verifyToken, EditCategory);
