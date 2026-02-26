const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// 1. REGISTER USER (Added this missing route)
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";

        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Email already exists" });
                }
                return res.status(500).json(err);
            }
            res.status(201).json({ 
                message: "User registered successfully", 
                userId: result.insertId 
            });
        });
    } catch (err) {
        res.status(500).json({ message: "Error creating user" });
    }
});

// 2. LOGIN USER
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        // Using your JWT_SECRET from .env
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    });
});

// 3. UPDATE USER 
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "UPDATE users SET name = ?, password_hash = ? WHERE user_id = ?";
        
        db.query(sql, [username, hashedPassword, id], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
            res.status(200).json({ message: "User updated successfully" });
        });
    } catch (err) {
        res.status(500).json({ message: "Hashing error" });
    }
});

// 4. DELETE USER
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE user_id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    });
});

module.exports = router;