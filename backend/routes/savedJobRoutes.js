const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            external_job_id,
            job_title,
            company_name,
            job_location
        } = req.body;

        if (!external_job_id || !job_title) {
            return res.status(400).json({
                message: "Job information is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO saved_jobs (
                user_id,
                external_job_id,
                job_source,
                job_title,
                company_name,
                job_location
            )
            VALUES ($1, $2, 'adzuna', $3, $4, $5)
            RETURNING id, external_job_id, job_title, company_name, job_location, saved_at`,
            [
                req.user.id,
                external_job_id,
                job_title,
                company_name || null,
                job_location || null
            ]
        );

        res.status(201).json({
            message: "Job saved successfully",
            savedJob: result.rows[0]
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Job is already saved"
            });
        }

        console.error("Save job error:", error);

        res.status(500).json({
            message: "Failed to save job"
        });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const { search = "" } = req.query;

        const searchTerm = `%${search.trim()}%`;

        const result = await pool.query(
            `SELECT
                id,
                external_job_id,
                job_source,
                job_title,
                company_name,
                job_location,
                saved_at
             FROM saved_jobs
             WHERE user_id = $1
             AND (
                job_title ILIKE $2
                OR company_name ILIKE $2
                OR job_location ILIKE $2
             )
             ORDER BY saved_at DESC`,
            [req.user.id, searchTerm]
        );

        res.json({
            savedJobs: result.rows
        });

    } catch (error) {
        console.error("Fetch saved jobs error:", error);

        res.status(500).json({
            message: "Failed to fetch saved jobs"
        });
    }
});
router.delete("/:externalJobId", authMiddleware, async (req, res) => {
    try {
        const { externalJobId } = req.params;

        const result = await pool.query(
            `DELETE FROM saved_jobs
             WHERE user_id = $1
             AND external_job_id = $2
             RETURNING id`,
            [req.user.id, externalJobId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Saved job not found"
            });
        }

        res.json({
            message: "Job removed from saved jobs"
        });

    } catch (error) {
        console.error("Unsave job error:", error);

        res.status(500).json({
            message: "Failed to remove saved job"
        });
    }
});

module.exports = router;

module.exports=router;