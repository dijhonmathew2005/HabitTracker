const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

/*
====================================
CREATE HABIT
POST /api/habits
====================================
*/
router.post("/", verifyToken, (req, res) => {
  const user_id = req.user.user_id;
  const { habit_name } = req.body;

  if (!habit_name) {
    return res.status(400).json({ message: "habit_name required" });
  }

  db.query(
    "INSERT INTO habits (user_id, habit_name) VALUES (?, ?)",
    [user_id, habit_name],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({
        habit_id: result.insertId,
        message: "Habit created successfully"
      });
    }
  );
});

/*
====================================
GET ALL HABITS (for logged-in user)
GET /api/habits
====================================
*/
router.get("/", verifyToken, (req, res) => {
  const user_id = req.user.user_id;

  db.query(
    "SELECT * FROM habits WHERE user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      res.status(200).json(results);
    }
  );
});

/*
====================================
GET SINGLE HABIT BY ID
GET /api/habits/:id
====================================
*/
router.get("/:id", verifyToken, (req, res) => {
  const user_id = req.user.user_id;
  const habitId = req.params.id;

  db.query(
    "SELECT * FROM habits WHERE habit_id = ? AND user_id = ?",
    [habitId, user_id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(404).json({ message: "Habit not found" });
      }

      res.status(200).json(results[0]);
    }
  );
});

/*
====================================
UPDATE HABIT
PUT /api/habits/:id
====================================
*/
router.put("/:id", verifyToken, (req, res) => {
  const user_id = req.user.user_id;
  const habitId = req.params.id;
  const { habit_name } = req.body;

  if (!habit_name) {
    return res.status(400).json({ message: "habit_name required" });
  }

  db.query(
    "UPDATE habits SET habit_name = ? WHERE habit_id = ? AND user_id = ?",
    [habit_name, habitId, user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Habit not found" });
      }

      res.status(200).json({ message: "Habit updated successfully" });
    }
  );
});

/*
====================================
DELETE HABIT
DELETE /api/habits/:id
====================================
*/
router.delete("/:id", verifyToken, (req, res) => {
  const user_id = req.user.user_id;
  const habitId = req.params.id;

  db.query(
    "DELETE FROM habits WHERE habit_id = ? AND user_id = ?",
    [habitId, user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Habit not found" });
      }

      res.status(200).json({ message: "Habit deleted successfully" });
    }
  );
});

module.exports = router;