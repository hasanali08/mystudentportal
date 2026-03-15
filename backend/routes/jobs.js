const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/auth");

/*
Create Job Application
Protected route - user_id is automatically set from JWT token
*/
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Get user_id from authenticated JWT token
    const user_id = req.user.id;

    const {
      company,
      role,
      location,
      applied_date,
      status,
      notes,
      job_link
    } = req.body;

    // Validate required fields
    if (!company) {
      return res.status(400).json({
        error: "Company name is required"
      });
    }

    const newJob = await pool.query(
      `INSERT INTO job_applications
      (user_id, company, role, location, applied_date, status, notes, job_link)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [user_id, company, role, location, applied_date, status, notes, job_link]
    );

    res.json(newJob.rows[0]);
  } catch (err) {
    console.error("CREATE JOB ERROR:", err);
    res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/*
Get All Jobs
Protected route - returns only current user's job applications
*/
router.get("/", authenticateToken, async (req, res) => {
  try {
    // Get user_id from authenticated JWT token
    const user_id = req.user.id;

    const jobs = await pool.query(
      "SELECT * FROM job_applications WHERE user_id = $1 ORDER BY applied_date DESC",
      [user_id]
    );

    res.json(jobs.rows);
  } catch (err) {
    console.error("GET JOBS ERROR:", err);
    res.status(500).json({
      error: "Server error"
    });
  }
});

/*
Update Status
Protected route - user can only update their own job applications
*/
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE job_applications SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *",
      [status, id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Job application not found"
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE JOB ERROR:", err);
    res.status(500).json({
      error: "Server error"
    });
  }
});

/*
Delete Job
Protected route - user can only delete their own job applications
*/
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(
      "DELETE FROM job_applications WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Job application not found"
      });
    }

    res.json({
      message: "Job application deleted",
      job: result.rows[0]
    });
  } catch (err) {
    console.error("DELETE JOB ERROR:", err);
    res.status(500).json({
      error: "Server error"
    });
  }
});

module.exports = router;