/**
 * Validates the authorId and returns an error response if invalid.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {boolean} - Returns true if validation passes, otherwise false.
 */
function validateAuthorId(req, res, next) {
  const authorId = parseInt(req.body.authorId, 10);

  if (!req.body.authorId) {
    res.status(400).json({ error: "Author ID is required" });
    return false;
  }

  if (isNaN(authorId)) {
    res.status(400).json({ error: "Invalid author ID" });
    return false;
  }

  if (authorId <= 0) {
    res.status(400).json({ error: "Author ID must be a positive integer" });
    return false;
  }

  req.authorId = authorId; // Attach validated authorId to the request object
  next();
}

module.exports = { validateAuthorId };
