const prisma = require("../db/prisma.js");

// Fetch all users
const fetchUsers = async () => {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    console.error("Error fetching users:", error);
    return { status: 500, error: "Failed to fetch users" };
  }
};

// Fetch user by ID
const fetchUserById = async (userId) => {
  try {
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch (error) {
    console.error("Error fetching user:", error);
    return { status: 500, error: "Failed to fetch user" };
  }
};

// Fetch user by email
const fetchUserByEmail = async (email) => {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return { status: 500, error: "Failed to fetch user by email" };
  }
};

// Create user
const createUser = async (userData) => {
  try {
    const { name, email, password } = userData;
    if (!name || !email || !password) {
      return { status: 400, error: "Name, email, and password are required" };
    }
    const existingUser = await fetchUserByEmail(email);
    if (existingUser) {
      return { status: 409, error: "User with this email already exists" };
    }
    return await prisma.user.create({
      data: { name, email, password },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return { status: 500, error: "Failed to create user" };
  }
};

// Update user profile
const updateUserProfile = async (userId, updatedData) => {
  try {
    const user = await fetchUserById(userId);
    if (!user) {
      return { status: 404, error: "User not found" };
    }
    return await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { status: 500, error: "Failed to update user profile" };
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    await prisma.user.delete({ where: { id: userId } });
    return { status: 200, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { status: 500, error: "Failed to delete user" };
  }
};

module.exports = {
  fetchUsers,
  fetchUserById,
  fetchUserByEmail,
  createUser,
  updateUserProfile,
  deleteUser,
};
