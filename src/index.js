import express from "express";
import dotenv from "dotenv";
import { userRoutes } from "./routes/user.routes.js";
import { connectDB } from "./config/db.js";
import { categoryRouter } from "./routes/category.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { cloudinaryConfig } from "./config/cloudinary.js";
import { blogRoute } from "./routes/blog.routes.js";
dotenv.config();
connectDB();
cloudinaryConfig()

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

// user routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", blogRoute);

app.listen(PORT, () => {
  console.log(`Sever is  running on ${PORT}`);
});

