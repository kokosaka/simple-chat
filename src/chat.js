import React from "react";

export default function Chat(props) {
  return (
    <div
      className="chat"
      style={{
        color: props.message.color,
        fontWeight: props.userName === props.message.user ? "bold" : "user",
      }}
    >
      <div>
        {props.message.user}: {props.message.msg}
      </div>
    </div>
  );
}
