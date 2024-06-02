import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setIsButtonDisabled(!validateInput(value));
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

  const handleSearch = async () => {
    if (validateInput()) {
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

  return (
    <div>
      <h1>Reddit Comment Retriever</h1>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter post URL"
      />
      <button onClick={handleSearch} disabled={isButtonDisabled}>
        Search
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment.body}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
