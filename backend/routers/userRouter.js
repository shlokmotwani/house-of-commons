const express = require("express");
const {
  fetchUsers,
  fetchUserById,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../utils/jwt");
const userRouter = express.Router();

//TODO: rename userId to authorId in the controller functions and update the imports accordingly

userRouter.get("/", authenticateToken, async (req, res) => {
  try {
    // Fetch all users
    const users = await fetchUsers();
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

userRouter.get("/:id", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Validate user ID
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    // Fetch user by ID
    const user = await fetchUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

userRouter.get("/:email", authenticateToken, async (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Fetch user by email
    const user = await fetchUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return res.status(500).json({ error: "Failed to fetch user by email" });
  }
});

//TODO: implement POST "/" API here

userRouter.put("/:id", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedData = req.body.data;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Validate user ID
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    // Update user profile
    const updatedUser = await updateUserProfile(userId, updatedData);
    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Failed to update user profile" });
  }
});

userRouter.delete("/:id", authenticateToken, async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Validate user ID
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    // Delete user
    // TODO: check if the user has any posts or comments before deleting
    // If the user has posts or comments, handle that case accordingly, such as deleting those related records first.

    const result = await deleteUser(userId);
    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = { userRouter, fetchUsers };
