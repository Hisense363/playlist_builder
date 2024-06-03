const axios = require("axios");
const config = require("../config/config");

async function getComments(subreddit, postId, accessToken) {
  try {
    const response = await axios.get(
      `${config.redditApiBaseUrl}/r/${subreddit}/comments/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": config.userAgent,
        },
      }
    );

    const comments = response.data[1].data.children.map((comment) => ({
      author: comment.data.author,
      body: comment.data.body,
      score: comment.data.score,
      createdAt: new Date(comment.data.created_utc * 1000).toISOString(),
    }));

    return comments;
  } catch (error) {
    console.error("Error retrieving comments:", error);
    throw error;
  }
}

module.exports = {
  getComments,
};
