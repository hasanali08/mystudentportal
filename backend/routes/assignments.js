const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

/*
CREATE ASSIGNMENT
POST /assignments
Protected route - requires authentication
user_id is automatically set from JWT token
*/
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Get user_id from authenticated JWT token
    const user_id = req.user.id;

    const {
      title,
      course,
      description,
      deadline,
      priority
    } = req.body;

    // Validate required fields
    if (!title || !course || !deadline || !priority) {
      return res.status(400).json({
        error: "Title, course, deadline, and priority are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO assignments
      (user_id, title, course, description, deadline, priority)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [user_id, title, course, description, deadline, priority]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error("CREATE ERROR:", err);

    res.status(500).json({
      error: "Server error"
    });
  }
});


/*
GET ALL ASSIGNMENTS
GET /assignments
Protected route - returns only current user's assignments
*/
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Get user_id from authenticated JWT token
    const user_id = req.user.id;

    const result = await pool.query(
      "SELECT * FROM assignments WHERE user_id = $1 ORDER BY deadline ASC",
      [user_id]
    );

    res.json(result.rows);

  } catch (err) {

    console.error("GET ALL ERROR:", err);

    res.status(500).json({
      error: "Server error"
    });
  }
});


/*
GET SINGLE ASSIGNMENT
GET /assignments/:id
Protected route - user can only access their own assignments
*/
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      "SELECT * FROM assignments WHERE id = $1 AND user_id = $2",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Assignment not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error("GET ONE ERROR:", err);

    res.status(500).json({
      error: "Server error"
    });
  }
});


/*
UPDATE ASSIGNMENT
PUT /assignments/:id
Protected route - user can only update their own assignments
*/
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const {
      title,
      course,
      description,
      deadline,
      priority,
      status
    } = req.body;

    const result = await pool.query(
      `UPDATE assignments
      SET title=$1,
          course=$2,
          description=$3,
          deadline=$4,
          priority=$5,
          status=$6
      WHERE id=$7 AND user_id=$8
      RETURNING *`,
      [title, course, description, deadline, priority, status, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Assignment not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error("UPDATE ERROR:", err);

    res.status(500).json({
      error: "Server error"
    });
  }
});


/*
DELETE ASSIGNMENT
DELETE /assignments/:id
Protected route - user can only delete their own assignments
*/
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      "DELETE FROM assignments WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Assignment not found"
      });
    }

    res.json({
      message: "Assignment deleted",
      assignment: result.rows[0]
    });

  } catch (err) {

    console.error("DELETE ERROR:", err);

    res.status(500).json({
      error: "Server error"
    });
  }
});

module.exports = router;