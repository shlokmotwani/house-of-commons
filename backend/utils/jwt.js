// This module provides functions to generate, verify, and authenticate JWT tokens.

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const TOKEN_EXPIRY_DURATION = "1h";
const JWT_SECRET_KEY = process.env.JWT_SECRET;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Function to generate a JWT token
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const options = {
    expiresIn: TOKEN_EXPIRY_DURATION,
  };

  return jwt.sign(payload, JWT_SECRET_KEY, options);
}

// Function to verify a JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: "Invalid token." });
  }

  req.user = decoded; // Attach user info to request
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
};
