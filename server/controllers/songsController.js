const spotifyAPI = require("../utils/spotifyAPI");

async function getSongs(query, accessToken) {
  const { song, artist } = query;
  const songs = await spotifyAPI.getSongs(artist, song, accessToken);
  return songs;
}

module.exports = {
  getSongs,
};
