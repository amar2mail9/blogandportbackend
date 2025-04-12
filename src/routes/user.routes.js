import express from "express";
import {
  deleteUser,
  getAllUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";

export const userRoutes = express.Router();

userRoutes.post("/auth/register", registerUser);
userRoutes.post("/auth", loginUser);
userRoutes.delete("/delete/:id", deleteUser);
userRoutes.get("/", getAllUser);
