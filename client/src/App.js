import React, { useState } from "react";
import axios from "axios";

function App() {
  const [commentValue, setCommentValue] = useState("");
  const [songValue, setSongValue] = useState("");
  const [artistValue, setArtistValue] = useState("");
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCommentButtonDisabled, setIsCommentButtonDisabled] = useState(true);
  const [isSongButtonDisabled, setIsSongButtonDisabled] = useState(true);

  const handleCommentChange = (event) => {
    const value = event.target.value;
    setCommentValue(value);
    setIsCommentButtonDisabled(!validateInput(value));
  };

  const handleSongChange = (event) => {
    const value = event.target.value;
    setSongValue(value);
    setIsSongButtonDisabled(!validateInput(value));
  };

  const handleArtistChange = (event) => {
    const value = event.target.value;
    setArtistValue(value);
    setIsSongButtonDisabled(!validateInput(value));
  };

  const validateInput = (value) => {
    const urlPattern = /^(?!\s*$)(?:.*reddit\.com\/r\/.*\/comments\/.*)/;
    return urlPattern.test(value);
  };

  const extractSubredditAndPostId = () => {
    const urlParts = inputValue.split("/");
    const subredditIndex = urlParts.findIndex((part) => part === "r");
    const commentsIndex = urlParts.findIndex((part) => part === "comments");
    if (subredditIndex !== -1 && commentsIndex !== -1) {
      const subreddit = urlParts[subredditIndex + 1];
      const postId = urlParts[commentsIndex + 1];
      return { subreddit, postId };
    }
    return null;
  };

  const handleCommentSearch = async () => {
    if (validateInput(inputValue)) {
      const { subreddit, postId } = extractSubredditAndPostId();
      if (subreddit && postId) {
        try {
          const response = await axios.get("/api/comments", {
            params: { subreddit, postId },
          });
          setComments(response.data);
          setErrorMessage("");
        } catch (error) {
          console.error("Error retrieving comments:", error);
          setErrorMessage("Failed to retrieve comments. Please try again.");
        }
      } else {
        setErrorMessage("Invalid Reddit post URL.");
      }
    } else {
      setErrorMessage("Please enter a valid Reddit post URL.");
    }
  };

  const handleSongSearch = async () => {
        const song =
          songValue.length > 0 ? songValue.split(" ").join("+") : null;
        const artist =
          artistValue.length > 0 ? artistValue.split(" ").join("+") : null;
        try {
          const response = await axios.get("/api/songs", {
            params: { song, artist },
          });
  };

  return (
    <div>
      <h1>Reddit Comment Retriever</h1>
      <h2>Enter a valid link to a reddit post</h2>
      <input
        type="text"
        value={commentValue}
        onChange={handleCommentChange}
        placeholder="Enter post URL"
      />
      <button onClick={handleCommentSearch} disabled={isCommentButtonDisabled}>
        Search
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment.body}</li>
        ))}
      </ul>
      <h2>Enter a song name</h2>
      <input
        type="text"
        value={songValue}
        onChange={handleSongChange}
        placeholder="Enter Song name"
      />
      <h2>Enter an artist name</h2>
      <input
        type="text"
        value={artistValue}
        onChange={handleArtistChange}
        placeholder="Enter Artist name"
      />
      <button onClick={handleSongSearch} disabled={isSongButtonDisabled}>
        Search for Song
      </button>
    </div>
  );
}

export default App;
