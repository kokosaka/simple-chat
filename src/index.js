import React from "react";
import ReactDOM from "react-dom";
import { w3cwebsocket } from "websocket";
import Chat from "./chat";
import Login from "./login";
import "./index.css";

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
  handleChange(e) {
    var value = e.target.id === "isLoggedIn" ? true : e.target.value;
    this.setState({
      [e.target.id]: value,
    });
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
          <div className="chats">
            <div className="message-bar">
              <input
                type="text"
                id="message"
                placeholder="message"
                value={this.state.message}
                onChange={this.handleChange}
              ></input>
              <button onClick={() => this.handleSend()}>send</button>
            </div>
            {this.state.messages.map((message, i) => (
              <Chat key={i} message={message} userName={this.state.user} />
            ))}
          </div>
        ) : (
          <Login handleChange={this.handleChange} user={this.state.user} />
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
