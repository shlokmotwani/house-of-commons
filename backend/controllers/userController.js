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

//Function to fetch a user by email
const fetchUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return { status: 500, error: "Failed to fetch user by email" };
  }
};

// Function to create a user
const createUser = async (userData) => {
  try {
    const { name, email, password } = userData;

    // Validate required fields
    if (!name || !email || !password) {
      return { status: 400, error: "Name, email, and password are required" };
    }

    // Check if user already exists
    const existingUser = await fetchUserByEmail(email);
    if (existingUser) {
      return { status: 409, error: "User with this email already exists" };
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Assume password is already hashed
      },
    });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return { status: 500, error: "Failed to create user" };
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
  fetchUserByEmail,
  createUser,
  updateUserProfile,
  deleteUser,
};
