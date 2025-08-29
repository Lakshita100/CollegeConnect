// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

/**
 * 📝 Signup Route
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, birthYear, gender, mobileNumber, username,  password } = req.body;

    if (!name || !birthYear || !gender || !mobileNumber || !username || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists (by email or username)
    const [existingUser] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const [result] = await db.query(
      "INSERT INTO users (name, birthYear, gender, mobileNumber, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, birthYear, gender, mobileNumber, username, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * 📝 Login Route
 */
router.post("/signin", async (req, res) => {
  try {
    const { username , password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find user
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        birthYear: user.birthYear,
        gender: user.gender,
        mobileNumber: user.mobileNumber,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
