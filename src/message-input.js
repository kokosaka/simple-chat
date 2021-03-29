import React from "react";

export default function MessageInput(props) {
  return (
    <div className="message-bar">
      <textarea
        type="text"
        id="message"
        placeholder="message"
        value={props.message}
        onChange={props.handleChange}
      />
      <button id="message-button" onClick={() => props.handleSend()}>
        send
      </button>
    </div>
  );
}
