const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "User registered" });
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

module.exports = router;