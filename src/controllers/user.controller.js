import { UserModels } from "../models/user.models.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// New Register User or create new account

export const registerUser = async (req, res) => {
  try {
    const { email, password, phone, fullname, role, username } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email field is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        error: "Password field is required.",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid email.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters long.",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false, // Corrected to false, as it's an error
        error: "Phone Number is required",
      });
    }

    if (!fullname) {
      return res.status(400).json({
        success: false, // Corrected to false, as it's an error
        error: "Fullname is required",
      });
    }

    if (!username) {
      return res.status(400).json({
        success: false,
        error: "Username is required",
      });
    }

    const isUser = await UserModels.findOne({
      $or: [{ email }, { phone }, { username }],
    });

    if (isUser) {
      return res.status(400).json({
        success: false,
        error: `User already exists with that email, phone, or username.`,
      });
    }

    // Admin Creation Logic
    if (role === "admin") {
      const existingAdmin = await UserModels.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          error: "An admin account already exists.",
        });
      }
    }

    const newUser = new UserModels({
      email,
      password,
      fullname,
      phone,
      role,
      username,
    });

    await newUser.save();

    // Exclude password from the response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "User registered successfully.",
      userdata: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }
};

// sign in user
export const loginUser = async (req, res) => {
  try {
    const { email, password, username, phone } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const isUser = await UserModels.findOne({
      $or: [{ email }, { username }, { phone }],
    });

    if (!isUser) {
      return res.status(400).json({
        success: false,
        message: "User not Exist! Create New Account",
      });
    }


    const isMatchPassword = await bcrypt.compare(password, isUser.password);

    if (!isMatchPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    } 

    if (isUser.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "User Not Admin",
      });
    }

    const accessToken = await jwt.sign(
      {
        id: isUser._id,
        email: isUser.email,
        username: isUser.username,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1d" }
    );
      return res.status(200).json({
        success: true,
        message: "Login Successfully",
        user: {
          id: isUser._id,
          username: isUser.username,
          email: isUser.email,
          accessToken
        },
      });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

// Delete User

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const isUser = await UserModels.findById(id);
   


    if (!isUser) {
      return res.status(404).json({
        success: false,
        error: "User Not Found",
      });
    }

    const deleteUser = await UserModels.deleteOne(isUser);

    return res.status(200).json({
      success: true,
      message: deleteUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

// all user

export const getAllUser = async (req, res) => {
  try {
    const users = await UserModels.find();
  
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};
