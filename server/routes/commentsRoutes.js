const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/commentsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  const accessToken = authMiddleware.getAccessToken();
  const comments = await commentsController.getComments(req.query, accessToken);
  res.json(comments);
});

module.exports = router;
