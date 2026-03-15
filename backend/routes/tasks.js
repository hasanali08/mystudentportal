const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

/*
Create Task
Protected route - user_id is automatically set from JWT token
*/
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Get user_id from authenticated JWT token
    const user_id = req.user.id;

    const { task, due_date } = req.body;

    // Validate required fields
    if (!task) {
      return res.status(400).json({
        error: "Task description is required"
      });
    }

    const newTask = await pool.query(
      `INSERT INTO tasks
      (user_id, task, due_date)
      VALUES ($1,$2,$3)
      RETURNING *`,
      [user_id, task, due_date]
    );

    res.json(newTask.rows[0]);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({
      error: "Server error"
    });
  }
});

/*
Get Tasks
Protected route - returns only current user's tasks
*/
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Get user_id from authenticated JWT token
    const user_id = req.user.id;

    const tasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC",
      [user_id]
    );

    res.json(tasks.rows);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({
      error: "Server error"
    });
  }
});

/*
Mark Complete
Protected route - user can only update their own tasks
*/
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { completed } = req.body;

    const result = await pool.query(
      "UPDATE tasks SET completed=$1 WHERE id=$2 AND user_id=$3 RETURNING *",
      [completed, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({
      error: "Server error"
    });
  }
});

/*
Delete Task
Protected route - user can only delete their own tasks
*/
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    res.json({
      message: "Task deleted",
      task: result.rows[0]
    });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({
      error: "Server error"
    });
  }
});

module.exports = router;