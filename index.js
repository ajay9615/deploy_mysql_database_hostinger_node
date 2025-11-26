const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ================ ADD TEACHER ================
app.post("/add-teacher", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)";
        const [result] = await pool.execute(sql, [name, email, hashedPassword]);

        res.status(201).json({
            message: "Teacher added successfully",
            id: result.insertId
        });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "Email already exists" });
        }
        console.error("Error adding teacher:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ================ GET ALL TEACHERS ================
app.get("/teachers", async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT id, name, email, created_at FROM teachers ORDER BY id DESC"
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching teachers:", err);
        res.status(500).json({ error: "Failed to fetch teachers" + err });
    }
});

// ================ LOGIN ================
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const [rows] = await pool.execute("SELECT * FROM teachers WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const teacher = rows[0];
        const isValid = await bcrypt.compare(password, teacher.password);

        if (!isValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Remove password from response
        const { password: _, ...safeTeacher } = teacher;

        res.json({
            message: "Login successful",
            teacher: safeTeacher
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ================ START SERVER ================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});