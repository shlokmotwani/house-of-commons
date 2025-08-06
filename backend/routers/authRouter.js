const express = require("express");
const { createUser, fetchUserByEmail } = require("../controllers/userController");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { generateToken } = require("../utils/jwt");
const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return res.status(500).json({ error: "Failed to hash password" });
    }

    const user = await createUser({ name, email, password: hashedPassword });

    if (user.status === 400) {
      return res.status(400).json({ error: user.error });
    }
    if (user.status === 409) {
      return res.status(409).json({ error: user.error });
    }
    if (user.status === 500) {
      console.error("Error creating user:", user.error);
      return res.status(500).json({ error: "Internal server error" });
    }

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error checking existing user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await fetchUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a token for the user
    const token = generateToken(user);

    if (!token) {
      return res.status(500).json({ error: "Failed to generate token" });
    }

    // Send the token back to the client
     return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { authRouter };
