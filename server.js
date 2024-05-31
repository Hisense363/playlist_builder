require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

const path = require("path");

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/", "index.html"));
});

app.get("/comments", async (req, res) => {
  try {
    const { subreddit, postId } = req.query;
    const accessToken = process.env.ACCESS_TOKEN;

    const response = await axios.get(
      `https://oauth.reddit.com/r/${subreddit}/comments/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "MyApp/1.0",
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
