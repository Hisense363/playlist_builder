import React, { useState } from "react";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="App">
      <div>
        <h1>Reddit Comment Retriever</h1>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter post URL"
        />
      </div>
    </div>
  );
}

export default App;
