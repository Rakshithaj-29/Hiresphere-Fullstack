const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { keyword = "developer", location = "india" } = req.query;

        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;

        const url =
            `https://api.adzuna.com/v1/api/jobs/in/search/1` +
            `?app_id=${appId}` +
            `&app_key=${appKey}` +
            `&results_per_page=15` +
            `&what=${encodeURIComponent(keyword)}` +
            `&where=${encodeURIComponent(location)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Adzuna API error: ${response.status}`);
        }

        const data = await response.json();

        res.json(data);

    } catch (error) {
        console.error("Job API error:", error);

        res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
});

module.exports = router;