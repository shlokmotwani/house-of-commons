const prisma = require("../db/prisma.js");

async function fetchPostByPostId(postId) {
  try {
    return await prisma.post.findUnique({ where: { id: postId } });
  } catch (error) {
    console.error("Error fetching post:", error);
    return { status: 500, error: "Failed to fetch post" };
  }
}

async function fetchPostsByAuthorId(authorId) {
  try {
    return await prisma.post.findMany({ where: { authorId } });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { status: 500, error: "Failed to fetch posts" };
  }
}

async function addPost(content, authorId) {
  try {
    return await prisma.post.create({ data: { content, authorId } });
  } catch (error) {
    console.error("Error adding post:", error);
    return { status: 500, error: "Failed to add post" };
  }
}

async function updatePost(postId, content) {
  try {
    return await prisma.post.update({
      where: { id: postId },
      data: { content },
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return { status: 500, error: "Failed to update post" };
  }
}

async function deletePost(postId) {
  try {
    await prisma.post.delete({ where: { id: postId } });
    return { status: 200, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { status: 500, error: "Failed to delete post" };
  }
}

module.exports = {
  fetchPostByPostId,
  fetchPostsByAuthorId,
  addPost,
  updatePost,
  deletePost,
};
