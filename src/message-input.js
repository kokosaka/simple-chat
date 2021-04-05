import React from "react";

export default function MessageInput(props) {
  return (
    <div>
      <form className="message-bar" onSubmit={(e) => props.handleSend(e)}>
        <textarea
          type="text"
          id="message"
          required
          value={props.message}
          onChange={props.handleChange}
          onKeyUp={props.handleEnter}
        />
        <button id="message-button" type="submit">
          send
        </button>
      </form>
    </div>
  );
}
