const { fetchPostsByAuthorId } = require("../controllers/postController.js");
const express = require("express");
const { validateAuthorId } = require("../middlewares/authMiddleware.js");
const postRouter = express.Router();

postRouter.get("/", validateAuthorId, async (req, res) => {
  try {
    // Fetch posts by author ID
    const posts = await fetchPostsByAuthorId(req.authorId);
    return res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
});

module.exports = postRouter;
