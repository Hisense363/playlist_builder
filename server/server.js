require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const authMiddleware = require("./middleware/authMiddleware");
const commentsRoutes = require("./routes/commentsRoutes");
const songsRoutes = require("./routes/songsRoutes");
const { redditApiBaseUrl, spotApiBaseUrl } = require("./config/config");

const app = express();

authMiddleware.refreshRedditAccessToken();
authMiddleware.refreshSpotifyAccessToken();

app.use("/api/comments", commentsRoutes);
app.use("/api/songs", songsRoutes);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/api/comments", async (req, res) => {
  try {
    const { subreddit, postId } = req.query;
    const accessToken = process.env.ACCESS_TOKEN;
    const userAgent = process.env.USER_AGENT;

    const response = await axios.get(
      `${redditApiBaseUrl}/r/${subreddit}/comments/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": `${userAgent}`,
        },
      }
    );

    const comments = response.data[1].data.children.map((comment) => ({
      author: comment.data.author,
      body: comment.data.body,
      score: comment.data.score,
      createdAt: new Date(comment.data.created_utc * 1000).toISOString(),
    }));

    res.json(comments);
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ error: "Failed to retrieve comments" });
  }
});

app.get("/api/songs", async (req, res) => {
  try {
    const { song, artist } = req.query;
    const response = await axios.get(
      `${spotApiBaseUrl}/search?q=${song}%2Ctype%3Dtrack%2Cartist%3A${artist}&type=track&market=US&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": `${userAgent}`,
        },
      }
    );

    const comments = response.data[1].data.children.map((comment) => ({
      author: comment.data.author,
      body: comment.data.body,
      score: comment.data.score,
      createdAt: new Date(comment.data.created_utc * 1000).toISOString(),
    }));

    res.json(comments);
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ error: "Failed to retrieve comments" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
