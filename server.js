// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const db = require("./db"); // ✅ import your db.js

const app = express();

// Middleware
app.use(cors()); // allow requests from React (port 3000)
app.use(bodyParser.json());

// API routes
app.use("/api/auth", authRoutes);

// Example root API
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// ✅ Test DB connection right after app setup
(async () => {
  try {
    const [rows] = await db.query("SELECT NOW() AS currentTime");
    console.log("✅ Test query successful:", rows[0].currentTime);
  } catch (err) {
    console.error("❌ Test query failed:", err.message);
  }
})();

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
