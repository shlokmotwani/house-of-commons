/**
 * Middleware to validate the authorId in the request body.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
function validateAuthorId(req, res, next) {
  const { authorId } = req.body;

  if (authorId === undefined || authorId === null) {
    return res.status(400).json({ error: "Author ID is required" });
  }

  const parsedAuthorId = Number(authorId);

  if (!Number.isInteger(parsedAuthorId) || parsedAuthorId <= 0) {
    return res
      .status(400)
      .json({ error: "Author ID must be a positive integer" });
  }

  req.authorId = parsedAuthorId;
  next();
}

module.exports = { validateAuthorId };
