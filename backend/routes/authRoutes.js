const express = require("express");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
const pool = require("../config/db");

console.log("AUTH ROUTES LOADED");
const authMiddleware=require("../middleware/authMiddleware")
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // 1. Check required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // 2. Check whether email already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insert user
        const result = await pool.query(
            `INSERT INTO users (name, email, password, phone)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, phone, role`,
            [name, email, hashedPassword, phone]
        );

        // 5. Send response
        res.status(201).json({
            message: "Registration successful",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    console.log("login route hit");
    try {
        console.log("login body",req.body);
        const { email, password } = req.body;

        // 1. Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 2. Find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];
        console.log("User found:", {
    id: user.id,
    email: user.email,
    hasPassword: !!user.password,
    passwordPrefix: user.password
        ? user.password.substring(0, 4)
        : null
});

        // 3. Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );
console.log("Password match",passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // 5. Send response
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;