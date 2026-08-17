const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/applications",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { 
        search = "",
        status = "All",
        page=1,
        limit=10 } = req.query;
    
       const pageNumber = Math.max(
        parseInt(page, 10) || 1,
        1
      );

      const limitNumber = 10;

      const offset = (pageNumber - 1) * limitNumber;


      const searchTerm = `%${search.trim()}%`;

      let countQuery = `
    SELECT COUNT(*) AS total
    FROM applications a
    INNER JOIN users u
        ON a.user_id = u.id
    WHERE (
        u.name ILIKE $1
        OR u.email ILIKE $1
        OR a.job_title ILIKE $1
        OR a.company_name ILIKE $1
        OR a.job_location ILIKE $1
    )
`;

const countValues = [searchTerm];

if (status !== "All") {
    countQuery += ` AND a.status = $2`;
    countValues.push(status);
}

const countResult = await pool.query(
    countQuery,
    countValues
);

const total = Number(countResult.rows[0].total);

      const allowedStatuses = [
        "All",
        "Applied",
        "Under Review",
        "Shortlisted",
        "Selected",
        "Rejected",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status filter",
        });
      }

      let query = `
        SELECT
          a.id,
          a.user_id,
          u.name AS candidate_name,
          u.email AS candidate_email,
          u.phone AS candidate_phone,
          a.external_job_id,
          a.job_source,
          a.job_title,
          a.company_name,
          a.job_location,
          a.qualification,
          a.specialization,
          a.university,
          a.graduation_year,
          a.work_status,
          a.experience_years,
          a.current_job_title,
          a.current_company,
          a.skills,
          a.expected_salary,
          a.notice_period,
          a.work_preference,
          a.resume_filename,
          a.cover_letter,
          a.status,
          a.applied_at
        FROM applications a
        INNER JOIN users u
          ON a.user_id = u.id
        WHERE (
          u.name ILIKE $1
          OR u.email ILIKE $1
          OR a.job_title ILIKE $1
          OR a.company_name ILIKE $1
          OR a.job_location ILIKE $1
        )
      `;

      const values = [searchTerm];

      if (status !== "All") {
        query += ` AND a.status = $2`;
        values.push(status);
      }

      query += ` ORDER BY a.applied_at DESC`;
      query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

values.push(limitNumber, offset);

      const result = await pool.query(query, values);

      res.json({
        applications: result.rows,
        page:pageNumber,
        limit:limitNumber,
        total,
        totalPages:Math.ceil(total/limitNumber)
      });
    } catch (error) {
      console.error("Admin applications error:", error);

      res.status(500).json({
        message: "Failed to fetch applications",
      });
    }
  }
);
router.patch(
    "/applications/:id/status",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const allowedStatuses = [
                "Applied",
                "Under Review",
                "Shortlisted",
                "Selected",
                "Rejected"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid application status"
                });
            }

            const result = await pool.query(
                `UPDATE applications
                 SET status = $1
                 WHERE id = $2
                 RETURNING id, job_title, company_name, status, applied_at`,
                [status, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Application not found"
                });
            }

            res.json({
                message: "Application status updated successfully",
                application: result.rows[0]
            });

        } catch (error) {
            console.error("Update application status error:", error);

            res.status(500).json({
                message: "Failed to update application status"
            });
        }
    }
);

router.get(
    "/applications/:id/resume",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await pool.query(
                `SELECT resume, resume_filename
                 FROM applications
                 WHERE id = $1`,
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Application not found"
                });
            }

            const application = result.rows[0];

            if (!application.resume) {
                return res.status(404).json({
                    message: "Resume not found"
                });
            }

            const filename = application.resume_filename || "resume";

            let contentType = "application/octet-stream";

            if (filename.toLowerCase().endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (filename.toLowerCase().endsWith(".doc")) {
                contentType = "application/msword";
            } else if (filename.toLowerCase().endsWith(".docx")) {
                contentType =
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }

            res.setHeader("Content-Type", contentType);
            res.setHeader(
                "Content-Disposition",
                `inline; filename="${filename.replace(/"/g, "")}"`
            );

            res.send(application.resume);

        } catch (error) {
            console.error("Resume fetch error:", error);

            res.status(500).json({
                message: "Failed to retrieve resume"
            });
        }
    }
);


router.delete(
  "/applications/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `DELETE FROM applications
         WHERE id = $1
         RETURNING id, job_title, company_name`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Application not found"
        });
      }

      res.json({
        message: "Application removed successfully",
        application: result.rows[0]
      });

    } catch (error) {
      console.error("Delete application error:", error);

      res.status(500).json({
        message: "Failed to remove application"
      });
    }
  }
);

module.exports = router;