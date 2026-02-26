const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  const user_id = req.user && (req.user.user_id || req.user.id);
  if (!user_id) return res.status(401).json({ message: "Unauthorized" });

  db.query(
    "SELECT * FROM logs WHERE user_id = ? ORDER BY date DESC",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

router.post("/", verifyToken, (req, res) => {
  const user_id = req.user && (req.user.user_id || req.user.id);
  const { habit_id, date, status } = req.body;

  if (!user_id) return res.status(401).json({ message: "Unauthorized" });
  if (!habit_id || !date) return res.status(400).json({ message: "habit_id and date required" });

  db.query(
    "INSERT INTO logs (user_id, habit_id, date, status) VALUES (?, ?, ?, ?)",
    [user_id, habit_id, date, status || null],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ log_id: result.insertId });
    }
  );
});

module.exports = router;
