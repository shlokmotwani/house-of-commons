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

// function to add a new post
const addPost = async (content, authorId) => {
  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId,
      },
    });
    return newPost;
  } catch (error) {
    console.error("Error adding post:", error);
    return { status: 500, error: "Failed to add post" };
  }
};

//function to update a post
const updatePost = async (postId, content) => {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content },
    });
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    return { status: 500, error: "Failed to update post" };
  }
};

// function to delete a post
const deletePost = async (postId) => {
  try {
    await prisma.post.delete({
      where: { id: postId },
    });
    return { status: 200, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { status: 500, error: "Failed to delete post" };
  }
};

module.exports = { fetchPostsByAuthorId, addPost, updatePost, deletePost };
