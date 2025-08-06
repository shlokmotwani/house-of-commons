const prisma = require("../db/prisma.js");

// function to handle fetching of posts by author ID
const fetchPostsByAuthorId = async (authorId) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId,
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { status: 500, error: "Failed to fetch posts" };
  }
};

module.exports = { fetchPostsByAuthorId };
