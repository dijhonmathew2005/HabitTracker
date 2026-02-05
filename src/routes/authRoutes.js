const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered successfully" });
    }
  );
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (results.length === 0) return res.status(401).json("User not found");

      const valid = await bcrypt.compare(password, results[0].password);
      if (!valid) return res.status(401).json("Wrong password");

      const token = jwt.sign(
        { id: results[0].user_id },
        process.env.JWT_SECRET
      );

      res.json({ token });
    }
  );
});

module.exports = router;
