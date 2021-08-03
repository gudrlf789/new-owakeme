import React from "react";
import "../assets/css/chat.css";

function chatting() {
  return (
    <div className="chat__container">
      <div className="top__groupbar">
        <h3>GroupBar</h3>
      </div>

      <div className="chat__message">
        <h3>chat__message</h3>
      </div>

      <div className="chat__footer">
        <input type="text" placeholder="input to text" />
      </div>
    </div>
  );
}

export default chatting;
