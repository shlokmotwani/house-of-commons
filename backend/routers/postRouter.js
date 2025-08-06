const express = require("express");
const {
  fetchPostsByAuthorId,
  addPost,
  updatePost,
  deletePost,
  fetchPostByPostId,
} = require("../controllers/postController.js");
const { validateAuthorId } = require("../middlewares/authMiddleware.js");
const { authenticateToken } = require("../utils/jwt.js");

const postRouter = express.Router();

// GET all posts by the authenticated author
postRouter.get("/", authenticateToken, validateAuthorId, async (req, res) => {
  try {
    const authorId = req.user.id;
    const posts = await fetchPostsByAuthorId(authorId);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET all posts by a specific authorId
postRouter.get("/:authorId", authenticateToken, async (req, res) => {
  const authorId = parseInt(req.params.authorId, 10);
  if (isNaN(authorId)) {
    return res
      .status(400)
      .json({ error: "Author ID is required and must be a number" });
  }
  try {
    const posts = await fetchPostsByAuthorId(authorId);
    if (!posts) {
      return res.status(404).json({ error: "Posts not found" });
    }
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// POST a new post
postRouter.post("/", authenticateToken, validateAuthorId, async (req, res) => {
  const { content } = req.body;
  if (!content || typeof content !== "string" || !content.trim()) {
    return res
      .status(400)
      .json({ error: "Content is required and must be a non-empty string" });
  }
  try {
    const newPost = await addPost(content, req.authorId);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Failed to add post" });
  }
});

// PUT update a post
postRouter.put(
  "/:id",
  authenticateToken,
  validateAuthorId,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { content } = req.body;
    if (!content || typeof content !== "string" || !content.trim()) {
      return res
        .status(400)
        .json({ error: "Content is required and must be a non-empty string" });
    }
    try {
      const updatedPost = await updatePost(id, content);
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  }
);

// DELETE a post (TODO: check authorId matches post's authorId before deleting)
postRouter.delete(
  "/:id",
  authenticateToken,
  validateAuthorId,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
      const result = await deletePost(id);
      res.status(result.status).json(result);
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  }
);

module.exports = postRouter;
