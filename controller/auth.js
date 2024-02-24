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
        errorMessage: "Bad Request",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
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
      return res
        .status(400)
        .json({ errorMessage: "Invalid Credentials" });
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
    const token = jwt.sign({ _id: userDetails._id }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });

    // You might want to exclude sending hashed password in the response
    //const { password: _, ...userData } = userDetails.toObject();

    res.status(200).json({ token, user: userDetails.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login };
