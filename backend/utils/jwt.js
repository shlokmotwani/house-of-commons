// JWT utility functions: generate, verify, and authenticate tokens.

const jwt = require("jsonwebtoken");
require("dotenv").config();

const TOKEN_EXPIRY_DURATION = "1h";
const JWT_SECRET_KEY = process.env.JWT_SECRET;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Generate a JWT token for a user
function generateToken({ id, email }) {
  return jwt.sign({ id, email }, JWT_SECRET_KEY, {
    expiresIn: TOKEN_EXPIRY_DURATION,
  });
}

// Verify a JWT token and return the decoded payload or null
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch {
    return null;
  }
}

// Express middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: "Invalid token." });
  }

  req.user = decoded;
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
};
