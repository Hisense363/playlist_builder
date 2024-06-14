const express = require("express");
const router = express.Router();
const songsController = require("../controllers/songsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", async (req, res) => {
  const spotifyAccessToken = authMiddleware.getSpotifyAccessToken();
  const song = await songsController.getSongs(req.query, spotifyAccessToken);
  res.json(song);
});

module.exports = router;
