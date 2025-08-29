// db.js
const mysql = require("mysql2");
require("dotenv").config();

// ✅ Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306, // MySQL default port
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "college_connect",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Test initial connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:");
    console.error("Code:", err.code);
    console.error("Message:", err.message);
    console.error("SQL State:", err.sqlState || "N/A");
  } else {
    console.log("✅ Connected to MySQL Database:", process.env.DB_NAME);
    connection.release();
  }
});

// ✅ Export promise-based pool for async/await queries
module.exports = pool.promise();
