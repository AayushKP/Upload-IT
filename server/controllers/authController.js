const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken = require("../utils/jwt");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists. Please log in." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.cookie("token", token, { httpOnly: true });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    console.log(token);
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
