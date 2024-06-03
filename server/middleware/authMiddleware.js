const axios = require("axios");
const config = require("../config/config");

async function obtainAccessToken() {
  try {
    const response = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      {
        grant_type: "client_credentials",
      },
      {
        auth: {
          username: config.clientId,
          password: config.clientSecret,
        },
        headers: {
          "user-agent": config.userAgent,
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;

    console.log("New access token obtained:", accessToken);

    return { accessToken, expiresIn };
  } catch (error) {
    console.error("Error obtaining access token:", error);
    throw error;
  }
}

let accessToken = null;

async function refreshAccessToken() {
  try {
    const { accessToken: newAccessToken, expiresIn } =
      await obtainAccessToken();
    accessToken = newAccessToken;

    setTimeout(refreshAccessToken, (expiresIn - 60) * 1000); // Refresh 1 minute before expiration
  } catch (error) {
    console.error("Error refreshing access token:", error);
    setTimeout(refreshAccessToken, 60000); // Retry after 1 minute
  }
}

function getAccessToken() {
  return accessToken;
}

module.exports = {
  refreshAccessToken,
  getAccessToken,
};
