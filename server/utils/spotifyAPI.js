const axios = require("axios");
const config = require("../config/config");

async function getSongs(artist, song, spotifyAccessToken) {
  try {
    const response = await axios.get(
      `${config.spotApiBaseUrl}/search?q=${song}%2Ctype%3Dtrack%2Cartist%3${artist}&type=track&market=US&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      }
    );
    function processSong(song) {
      console.log(song);
    }
    return processSong(response);
  } catch (error) {
    console.error("Error retrieving comments:", error);
    throw error;
  }
}

module.exports = {
  getSongs,
};
