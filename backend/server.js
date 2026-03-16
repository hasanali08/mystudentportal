const assignmentRoutes = require("./routes/assignments");
const taskRoutes = require("./routes/tasks");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/users");
const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes (no authentication required)
app.use("/users", userRoutes);

// Protected routes (require authentication)
app.use("/assignments", assignmentRoutes);
app.use("/tasks", taskRoutes);
app.use("/jobs", jobRoutes);

/*
--------------------------------
Root Route
--------------------------------
*/
app.get("/", (req, res) => {
  res.send("Student Command Center API is running");
});

/*
--------------------------------
Test Database Connection
--------------------------------
*/
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

/*
--------------------------------
Start Server
--------------------------------
*/
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Test it at: http://localhost:${PORT}`);
  console.log(`📊 Test DB at: http://localhost:${PORT}/test-db`);
});

// Handle uncaught errors gracefully
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});