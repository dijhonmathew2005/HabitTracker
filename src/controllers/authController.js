const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// 1. Prioritize the .env secret for security
const JWT_SECRET = process.env.JWT_SECRET || "habit_tracker_super_secret_key_123";

// --- REGISTER ROUTE ---
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 2. Hash password before saving to Aiven DB
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("❌ Register DB Error:", err);
          return res.status(500).json({ message: "Email already exists or database error." });
        }

        // 3. Generate token using the new insertId
        const token = jwt.sign(
          { user_id: result.insertId }, 
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(201).json({ 
          message: "User registered successfully", 
          token,
          user: { name, email } 
        });
      }
    );
  } catch (err) {
    console.error("❌ Hashing Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// --- LOGIN ROUTE ---
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 4. Query the user by email from the 'users' table
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("❌ Login DB Error:", err);
      return res.status(500).json({ message: "Database connection failed." });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ message: "Account not found." });
    }

    const user = results[0];

    try {
      // 5. Compare the password with the hash in DBeaver
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ message: "Incorrect password." });
      }

      // 6. Fix for previous 500 error: Include JWT_SECRET correctly
      const token = jwt.sign(
        { user_id: user.user_id },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log(`✅ User logged in: ${user.email}`);
      res.json({ 
        token, 
        user: { id: user.user_id, name: user.name } 
      });
    } catch (error) {
      console.error("❌ JWT/Bcrypt Error:", error);
      res.status(500).json({ message: "Encryption error during login." });
    }
  });
});

module.exports = router;