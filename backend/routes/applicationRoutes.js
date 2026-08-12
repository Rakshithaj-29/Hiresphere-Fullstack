const express = require("express");
const multer = require("multer");

const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF, DOC and DOCX files are allowed"));
        }
    }
});

router.post(
    "/",
    authMiddleware,
    upload.single("resume"),
    async (req, res) => {

        try {
            console.log("REQ BODY:", req.body);
            console.log("REQ FILE:", req.file);

            console.log("Authenticated user:", req.user);
            console.log("Uploaded file:", req.file?.originalname);

            const {
                external_job_id,
                job_title,
                company_name,
                job_location,
                qualification,
                specialization,
                university,
                graduation_year,
                work_status,
                experience_years,
                current_job_title,
                current_company,
                skills,
                expected_salary,
                notice_period,
                work_preference,
                cover_letter
            } = req.body;

            if (
                !external_job_id ||
                !job_title ||
                !qualification ||
                !work_status ||
                !skills
            ) {
                return res.status(400).json({
                    message: "Required application fields are missing"
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: "Resume is required"
                });
            }

            const result = await pool.query(
                `INSERT INTO applications (
                    user_id,
                    external_job_id,
                    job_source,
                    job_title,
                    company_name,
                    job_location,
                    qualification,
                    specialization,
                    university,
                    graduation_year,
                    work_status,
                    experience_years,
                    current_job_title,
                    current_company,
                    skills,
                    expected_salary,
                    notice_period,
                    work_preference,
                    resume_filename,
                    resume,
                    cover_letter
                )
                VALUES (
                    $1,
                    $2,
                    'adzuna',
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11,
                    $12,
                    $13,
                    $14,
                    $15,
                    $16,
                    $17,
                    $18,
                    $19,
                    $20
                )
                RETURNING id, job_title, company_name, status, applied_at`,
                [
                    req.user.id,
                    external_job_id,
                    job_title,
                    company_name || null,
                    job_location || null,
                    qualification,
                    specialization || null,
                    university || null,
                    graduation_year || null,
                    work_status,
                    experience_years || 0,
                    current_job_title || null,
                    current_company || null,
                    skills,
                    expected_salary || null,
                    notice_period || null,
                    work_preference || null,
                    req.file.originalname,
                    req.file.buffer,
                    cover_letter || null
                ]
            );

            res.status(201).json({
                message: "Application submitted successfully",
                application: result.rows[0]
            });

        } catch (error) {

            console.error("Application error:", error);

            res.status(500).json({
                message: "Failed to submit application"
            });
        }
    }
);

router.get("/my",authMiddleware,async(req,res)=>{
    try{
        const result=await pool.query(
            `SELECT id,external_job_id,
            job_source,
            job_title,
            company_name,
            job_location,
            qualification,work_status,experience_years,skills,expected_salary,notice_period,work_preference,resume_filename,cover_letter,status,applied_at FROM applications WHERE user_id=$1 ORDER BY applied_at DESC`,[req.user.id]);
            res.json({
                applications :result.rows
            });
        
    }catch(error){
      console.error("Fetch applications error",error);
      res.status(500).json({
        message:"Failed to fetch applications"
      });
    }
});

module.exports = router;