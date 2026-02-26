const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  let token = req.headers["authorization"] || req.headers["Authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  // support "Bearer <token>"
  if (token.startsWith("Bearer ")) token = token.slice(7);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;