require("dotenv").config();
const express=require("express");
const cors=require("cors");

const pool=require('./config/db');
const app=express();
const authRoutes=require('./routes/authRoutes');
const jobRoutes=require('./routes/jobRoutes');
const applicationRoutes=require('./routes/applicationRoutes');
const savedJobRoutes=require('./routes/savedJobRoutes');
const adminRoutes=require('./routes/adminRoutes');
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.originalUrl);
    next();
});

app.use("/api/auth",authRoutes);
app.use("/api/jobs",jobRoutes)
app.use("/api/applications",applicationRoutes);
app.use("/api/saved-jobs",savedJobRoutes);
app.use("/api/admin",adminRoutes);

const PORT=process.env.PORT||5000;
app.get("/",(req,res)=>{
    res.send('Hiresphere backend is running');
});
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "PostgreSQL connected successfully!",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
            message: "Database connection failed"
        });
    }
});
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});