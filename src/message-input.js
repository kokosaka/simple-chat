import React from "react";

export default function MessageInput(props) {
  return (
    <div className="message-bar">
      <input
        type="text"
        id="message"
        placeholder="message"
        value={props.message}
        onChange={props.handleChange}
      />
      <button onClick={() => props.handleSend()}>send</button>
    </div>
  );
}
