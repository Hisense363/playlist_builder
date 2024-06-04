require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  redditApiBaseUrl: "https://oauth.reddit.com",
  redClientId: process.env.REDDIT_CLIENT_ID,
  redClientSecret: process.env.REDDIT_CLIENT_SECRET,
  spotClientId: process.env.SPOTIFY_CLIENT_ID,
  spotClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  userAgent: process.env.USER_AGENT,
};
