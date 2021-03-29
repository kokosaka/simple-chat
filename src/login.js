import React from "react";

export default function Login(props) {
  return (
    <div className="login">
      <h1>chat</h1>
      <form
        className="login-bar"
        id="isLoggedIn"
        onSubmit={(e) => props.handleChange(e)}
      >
        <input
          type="text"
          id="user"
          placeholder="username"
          required
          minLength="3"
          value={props.user}
          onChange={props.handleChange}
        />
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
}
