// src/routes/habitRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all habits for a user
router.get("/", (req, res) => {
    db.query("SELECT * FROM habits", (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(results);
    });
});

// POST a new habit
router.post("/", (req, res) => {
    const { user_id, habit_name, description } = req.body;
    db.query("INSERT INTO habits (user_id, habit_name, description) VALUES (?, ?, ?)",
    [user_id, habit_name, description], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Habit created", id: result.insertId });
    });
});

module.exports = router;