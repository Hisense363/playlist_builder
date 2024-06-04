const axios = require("axios");
const config = require("../config/config");

async function obtainRedditAccessToken() {
  try {
    const response = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      {
        grant_type: "client_credentials",
      },
      {
        auth: {
          username: config.redClientId,
          password: config.redClientSecret,
        },
        headers: {
          "user-agent": config.userAgent,
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;

    console.log("New Reddit access token obtained:", accessToken);

    return { accessToken, expiresIn };
  } catch (error) {
    console.error("Error obtaining Reddit access token:", error);
    throw error;
  }
}

let redditAccessToken = null;

async function refreshRedditAccessToken() {
  try {
    const { accessToken: newAccessToken, expiresIn } =
      await obtainRedditAccessToken();
    redditAccessToken = newAccessToken;

    setTimeout(refreshRedditAccessToken, (expiresIn - 60) * 1000); // Refresh 1 minute before expiration
  } catch (error) {
    console.error("Error refreshing access token:", error);
    setTimeout(refreshRedditAccessToken, 60000); // Retry after 1 minute
  }
}

function getRedditAccessToken() {
  return redditAccessToken;
}

async function obtainSpotifyAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "client_credentials",
        client_id: config.spotClientId,
        client_secret: config.spotClientSecret,
      },
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in;

    console.log("New Spotify access token obtained:", accessToken);

    return { accessToken, expiresIn };
  } catch (error) {
    console.error("Error obtaining Spotify access token:", error);
    throw error;
  }
}

let spotifyAccessToken = null;

async function refreshSpotifyAccessToken() {
  try {
    const { accessToken: newAccessToken, expiresIn } =
      await obtainSpotifyAccessToken();
    spotifyAccessToken = newAccessToken;

    setTimeout(refreshSpotifyAccessToken, (expiresIn - 60) * 1000); // Refresh 1 minute before expiration
  } catch (error) {
    console.error("Error refreshing access token:", error);
    setTimeout(refreshSpotifyAccessToken, 60000); // Retry after 1 minute
  }
}

function getSpotifyAccessToken() {
  return spotifyAccessToken;
}

module.exports = {
  refreshRedditAccessToken,
  getRedditAccessToken,
  refreshSpotifyAccessToken,
  getSpotifyAccessToken,
};
