const axios = require("axios");
const config = require("../config/config");

async function getComments(subreddit, postId, redditAccessToken) {
  try {
    const response = await axios.get(
      `${config.redditApiBaseUrl}/r/${subreddit}/comments/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${redditAccessToken}`,
          "User-Agent": config.userAgent,
        },
      }
    );
    function processComments(comments) {
      const flatComments = [];

      function processComment(comment) {
        flatComments.push({
          author: comment.data.author,
          body: comment.data.body,
          score: comment.data.score,
          createdAt: new Date(comment.data.created_utc * 1000).toISOString(),
        });

        if (comment.data.replies && comment.data.replies.data.children) {
          comment.data.replies.data.children.forEach((reply) => {
            if (reply.kind === "t1") {
              processComment(reply);
            }
          });
        }
      }

      comments.forEach((comment) => {
        if (comment.kind === "t1") {
          processComment(comment);
        }
      });
      return flatComments;
    }
    return processComments(response.data[1].data.children);
  } catch (error) {
    console.error("Error retrieving comments:", error);
    throw error;
  }
}

module.exports = {
  getComments,
};
