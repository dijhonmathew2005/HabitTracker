// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/db");

// PUT /api/auth/:id
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body; // Incoming from Postman

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // UPDATED: Matches your DBeaver columns 'name' and 'password_hash'
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

module.exports = router;