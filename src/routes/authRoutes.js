const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Make sure to npm install jsonwebtoken
const db = require("../config/db");

// 1. UPDATE USER (You already have this working!)
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

// 2. DELETE USER (New Action)
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE user_id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    });
});

// 3. LOGIN USER (Required for JWT Authentication)
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check if user exists using the email column from your DBeaver screenshot
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        const user = results[0];

        // Compare password with the password_hash column in your DB
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        // Generate Token (Replace 'your_jwt_secret' with process.env.JWT_SECRET later)
        const token = jwt.sign({ id: user.user_id }, "your_jwt_secret", { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    });
});

module.exports = router;