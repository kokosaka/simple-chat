import React from "react";

export default function Login(props) {
  return (
    <div className="login">
      <h1>chat</h1>
      <div className="login-bar">
        <input
          type="text"
          id="user"
          placeholder="username"
          value={props.user}
          onChange={props.handleChange}
        />
        <button id="isLoggedIn" onClick={(e) => props.handleChange(e)}>
          login
        </button>
      </div>
    </div>
  );
}
