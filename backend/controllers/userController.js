const prisma = require("../db/prisma.js");

// Function to fetch all users
const fetchUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { status: 500, error: "Failed to fetch users" };
  }
};

// Function to fetch a user by ID
const fetchUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { status: 500, error: "Failed to fetch user" };
  }
};

// Function to update a user's profile
const updateUserProfile = async (userId, updatedData) => {
  try {
    const user = fetchUserById(userId);
    if (!user) {
      return { status: 404, error: "User not found" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...user,
        ...updatedData,
      },
    });
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { status: 500, error: "Failed to update user profile" };
  }
};

// Function to delete a user
const deleteUser = async (userId) => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return { status: 200, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { status: 500, error: "Failed to delete user" };
  }
};

module.exports = {
  fetchUsers,
  fetchUserById,
  updateUserProfile,
  deleteUser,
};
