import React from "react";
import "../styles/messagecontainer.css";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

function MessageContainer({ messageList }) {
  return (
    <div className="chat-container">
      {messageList.map((message, index) => (
        <div key={index} className={`msg-container ${message.author === "User" ? "message-right" : "message-left"}`}>
          <div className={`message ${message.author === "User" ? "user-message" : "assistant-message"}`}>
            <div className="author">
              {message.author === "User" ? <PersonIcon /> : <SmartToyIcon />} {message.author}
            </div>
            <div className="content">{message.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageContainer;
