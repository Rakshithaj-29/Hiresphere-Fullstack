const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const {
            keyword = "",
            location = "",
            page = 1,
            limit = 15
        } = req.query;

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

        const limitNumber = Math.min(
            Math.max(parseInt(limit, 10) || 15, 1),
            50
        );

        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;

        const url =
            `https://api.adzuna.com/v1/api/jobs/in/search/${pageNumber}` +
            `?app_id=${appId}` +
            `&app_key=${appKey}` +
            `&results_per_page=${limitNumber}` +
            `&what=${encodeURIComponent(keyword)}` +
            `&where=${encodeURIComponent(location)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Adzuna API error: ${response.status}`);
        }

        const data = await response.json();

        res.json({
            results: data.results || [],
            count: data.count || 0,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil((data.count || 0) / limitNumber)
        });

    } catch (error) {
        console.error("Job API error:", error);

        res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
});

module.exports = router;