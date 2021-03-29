import React from "react";
import ReactDOM from "react-dom";
import { w3cwebsocket } from "websocket";
import "./index.css";

import Chat from "./chat";
import Login from "./login";
import MessageInput from "./message-input";

const client = new w3cwebsocket("ws://localhost:8000");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: "",
      message: "",
      messages: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentDidMount() {
    client.onopen = () => {
      console.log("websocket client connected");
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(data);
      if (data.type === "message") {
        this.setState((state) => ({
          messages: [
            ...state.messages,
            {
              msg: data.msg,
              user: data.user,
            },
          ],
        }));
      }
    };
  }
  handleChange(event) {
    event.preventDefault();
    var value = event.target.id === "isLoggedIn" ? true : event.target.value;
    // if (value === "isLoggedIn" && user.length < 3) {
    //   prompt("please type in a username");
    // } else {
    this.setState({
      [event.target.id]: value,
    });

    // }
  }

  handleSend() {
    client.send(
      JSON.stringify({
        type: "message",
        msg: this.state.message,
        user: this.state.user,
      })
    );
    this.setState({
      message: "",
    });
  }

  render() {
    return (
      <div className="main">
        {this.state.isLoggedIn ? (
          <div className="chatScreen">
            <div className="chats">
              {this.state.messages.map((message, i) => (
                <Chat key={i} message={message} userName={this.state.user} />
              ))}
            </div>
            <MessageInput
              handleChange={this.handleChange}
              handleSend={this.handleSend}
              message={this.state.message}
            />
          </div>
        ) : (
          <Login handleChange={this.handleChange} user={this.state.user} />
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
