const express = require("express");
const db = require("../db");

const router = express.Router();


router.post("/", (req, res) => {
  const { user_id, habit_name } = req.body;

  db.query(
    "INSERT INTO habits (user_id, habit_name) VALUES (?, ?)",
    [user_id, habit_name],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Habit added" });
    }
  );
});


router.get("/:user_id", (req, res) => {
  db.query(
    "SELECT * FROM habits WHERE user_id = ?",
    [req.params.user_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

module.exports = router;
