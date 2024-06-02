const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/comments", async (req, res) => {
  try {
    const { postUrl } = req.query;
    // Extract the subreddit and post ID from the post URL
    const subreddit = "AskReddit"; // Replace with the actual subreddit
    const postId = "abc123"; // Replace with the actual post ID

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
