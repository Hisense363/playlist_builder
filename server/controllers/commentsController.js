const redditApi = require("../utils/redditAPI");

async function getComments(query, accessToken) {
  const { subreddit, postId } = query;
  const comments = await redditApi.getComments(subreddit, postId, accessToken);
  return comments;
}

module.exports = {
  getComments,
};
