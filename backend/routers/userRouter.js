const express = require("express");
const {
  fetchUsers,
  fetchUserById,
  fetchUserByEmail,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../utils/jwt");

const userRouter = express.Router();

// TODO: rename userId to authorId in the controller functions and update the imports accordingly
// TODO: User Authorization

// Fetch all users
userRouter.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Fetch user by ID
userRouter.get("/id/:id", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Fetch user by email
userRouter.get("/email/:email", authenticateToken, async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await fetchUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ error: "Failed to fetch user by email" });
  }
});

// Update user profile
userRouter.put("/:id", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedData = req.body.data;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const updatedUser = await updateUserProfile(userId, updatedData);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

// Delete user
userRouter.delete("/:id", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    // TODO: check if the user has any posts or comments before deleting
    const result = await deleteUser(userId);
    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = { userRouter, fetchUsers };
