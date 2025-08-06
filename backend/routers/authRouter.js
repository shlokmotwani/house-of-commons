const express = require("express");
const {
  createUser,
  fetchUserByEmail,
} = require("../controllers/userController");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { generateToken } = require("../utils/jwt");

const authRouter = express.Router();

// Helper to handle errors
const handleError = (res, status, error) => res.status(status).json({ error });

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return handleError(res, 400, "All fields are required");
  }

  try {
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword)
      return handleError(res, 500, "Failed to hash password");

    const user = await createUser({ name, email, password: hashedPassword });

    if (user.status) {
      const status = [400, 409, 500].includes(user.status) ? user.status : 500;
      const errorMsg = user.error || "Internal server error";
      if (status === 500) console.error("Error creating user:", errorMsg);
      return handleError(res, status, errorMsg);
    }

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return handleError(res, 500, "Internal server error");
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return handleError(res, 400, "Email and password are required");
  }

  try {
    const user = await fetchUserByEmail(email);
    if (!user) return handleError(res, 404, "User not found");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return handleError(res, 401, "Invalid credentials");

    const token = generateToken(user);
    if (!token) return handleError(res, 500, "Failed to generate token");

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    return handleError(res, 500, "Internal server error");
  }
});

module.exports = { authRouter };
