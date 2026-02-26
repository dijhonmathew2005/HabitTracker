const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const habitRoutes = require("./src/routes/habitRoutes");
const logRoutes = require("./src/routes/logRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
  res.send("Habit Tracker Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
