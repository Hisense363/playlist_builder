const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  const redditAccessToken = authMiddleware.getRedditAccessToken();
  const comments = await commentsController.getComments(
    req.query,
    redditAccessToken
  );
  res.json(comments);
});

module.exports = router;
