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
      numOfUsers: 0,
      user: "",
      message: "",
      userColor: "",
      messages: [],
    };
    this.lastMessage = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    this.setState({
      userColor: "#" + ((Math.random() * 0xffffff) << 0).toString(16),
    });

    window.onbeforeunload = function () {
      console.log("client leaving");
      client.close();
    };
    client.onopen = () => {
      console.log("websocket client connected.");
    };

    client.onclose = function () {
      console.log("websocket server has closed.");
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
              color: data.color,
            },
          ],
          numOfUsers: data.userCount,
        }));
      }
      this.scrollToBottom();
    };
  }
  handleChange(event) {
    event.preventDefault();
    var value = event.target.id === "isLoggedIn" ? true : event.target.value;
    if (event.target.id === "isLoggedIn") {
      this.sendLogin();
    }
    this.setState({
      [event.target.id]: value,
    });
  }

  handleSend() {
    client.send(
      JSON.stringify({
        type: "message",
        userCount: this.state.numOfUsers,
        msg: this.state.message,
        user: this.state.user,
        color: this.state.userColor,
      })
    );
    this.setState({
      message: "",
    });
  }

  sendLogin() {
    client.send(
      JSON.stringify({
        type: "login",
        user: this.state.user,
      })
    );
  }

  scrollToBottom() {
    if (!this.lastMessage.current) return;
    this.lastMessage.current.scrollIntoView();
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
              <div ref={this.lastMessage} id="ref" />
            </div>
            <div className="user-count">
              {this.state.numOfUsers} users are online
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
