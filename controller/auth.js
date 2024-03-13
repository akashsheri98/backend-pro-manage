const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

const register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !confirmPassword || !password) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(401).json({ message: "Passwords do not match" });
    }

    // Check if user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    // Save user to the database
    const userResponse = await newUser.save();
    console.log(userResponse._id);

    const token = await jwt.sign(
      { userId: userResponse._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, { httpOnly: true });

    res.status(201).json({
      message: "User registered successfully",
      token: token,
      name: username,
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Find user by email
    const userDetails = await User.findOne({ email });
    if (!userDetails) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      userDetails.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create and assign a token
    const token = jwt.sign({ userId: userDetails._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true , secure:false });
   
    
    console.log(token);
    console.log(userDetails.email);
    
    // You might want to exclude sending hashed password in the response
    //const { password: _, ...userData } = userDetails.toObject();

    return res.status(200).json({
      message: "Logged in Successfully",
      token,
      user: userDetails.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    {
      res.clearCookie("token");
      res.status(200).json({ message: "Logged out successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { username ,oldPassword, newPassword } = req.body;

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    const userId = decoded.userId;
    const userDetails = await User.findById(userId); // Find user by ID from token
    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    // Update the password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    userDetails.password = hashedNewPassword;
    await userDetails.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, logout, resetPassword };
