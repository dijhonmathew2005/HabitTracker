const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, (req, res) => {
  const user_id = req.user && (req.user.user_id || req.user.id);
  const { habit_name } = req.body;

  if (!user_id) return res.status(401).json({ message: "Unauthorized" });
  if (!habit_name) return res.status(400).json({ message: "habit_name required" });

  db.query(
    "INSERT INTO habits (user_id, habit_name) VALUES (?, ?)",
    [user_id, habit_name],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ habit_id: result.insertId, message: "Habit added" });
    }
  );
});

router.get("/", verifyToken, (req, res) => {
  const user_id = req.user && (req.user.user_id || req.user.id);
  if (!user_id) return res.status(401).json({ message: "Unauthorized" });

  db.query(
    "SELECT * FROM habits WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

router.put("/:id", verifyToken, (req, res) => {
  const user_id = req.user && (req.user.user_id || req.user.id);
  const habitId = req.params.id;
  const { habit_name } = req.body;

  if (!user_id) return res.status(401).json({ message: "Unauthorized" });

  db.query(
    "UPDATE habits SET habit_name = ? WHERE id = ? AND user_id = ?",
    [habit_name, habitId, user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Habit updated" });
    }
  );
});

router.delete("/:id", verifyToken, (req, res) => {
  const user_id = req.user && (req.user.user_id || req.user.id);
  const habitId = req.params.id;

  if (!user_id) return res.status(401).json({ message: "Unauthorized" });

  db.query(
    "DELETE FROM habits WHERE id = ? AND user_id = ?",
    [habitId, user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Habit deleted" });
    }
  );
});

module.exports = router;
