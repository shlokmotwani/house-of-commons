const {
  fetchPostsByAuthorId,
  addPost,
  updatePost,
  deletePost,
  fetchPostByPostId,
} = require("../controllers/postController.js");
const express = require("express");
const { validateAuthorId } = require("../middlewares/authMiddleware.js");
const { authenticateToken } = require("../utils/jwt.js");
const postRouter = express.Router();

//TODO: User Authorization

postRouter.get("/", authenticateToken, validateAuthorId, async (req, res) => {
  try {
    const authorId = req.user.id;
    // Fetch posts by author ID
    const posts = await fetchPostsByAuthorId(authorId);
    return res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});

postRouter.get("/:authorId", authenticateToken, async (req, res) => {
  const authorId = parseInt(req.params.authorId, 10);
  if (!authorId || isNaN(authorId)) {
    return res
      .status(400)
      .json({ error: "Author ID is required and must be a number" });
  }

  try {
    // Fetch post by author ID
    const post = await fetchPostsByAuthorId(authorId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    return res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ error: "Failed to fetch post" });
  }
});

postRouter.post("/", authenticateToken, validateAuthorId, async (req, res) => {
  const { content } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res
      .status(400)
      .json({ error: "Content is required and must be a non-empty string" });
  }

  try {
    // Add a new post
    const newPost = await addPost(content, req.authorId);
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error adding post:", error);
    return res.status(500).json({ error: "Failed to add post" });
  }
});

postRouter.put(
  "/:id",
  authenticateToken,
  validateAuthorId,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { content } = req.body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return res
        .status(400)
        .json({ error: "Content is required and must be a non-empty string" });
    }

    try {
      // Update the post
      const updatedPost = await updatePost(id, content);
      return res.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      return res.status(500).json({ error: "Failed to update post" });
    }
  }
);

//TODO: check if the authorId matches the post's authorId before deleting
postRouter.delete(
  "/:id",
  authenticateToken,
  validateAuthorId,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
      // Delete the post
      const result = await deletePost(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error("Error deleting post:", error);
      return res.status(500).json({ error: "Failed to delete post" });
    }
  }
);

module.exports = postRouter;
