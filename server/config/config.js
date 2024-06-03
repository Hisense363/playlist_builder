require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  redditApiBaseUrl: "https://oauth.reddit.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  userAgent: process.env.USER_AGENT,
};
