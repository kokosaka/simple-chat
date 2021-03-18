import React from 'react';
import ReactDOM from 'react-dom';
import { w3cwebsocket } from 'websocket';

const client = new w3cwebsocket('ws://localhost:8000');

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      user: '',
      messages: [],
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount() {
    client.onopen = () => {
      console.log("websocket client connected")
    }
    client.onmessage= (message) => {
      const data = JSON.parse(message.data);
      console.log(data);
      if(data.type === "message") {
        this.setState((state) => ({
          messages: [...state.messages,
          {
            msg: data.msg,
            user: data.user,
          }]
        })
        );
      }
    }
  }
  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    })
  }

  handleSend(value) {
    client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: this.state.user,
    }));
  }

  render() {
    return (
      <div className="main">
        {this.state.isLoggedIn ?
        <div>
          <button onClick={() => this.handleSend("joe")} >Send</button>
          {this.state.messages.map((message) => (
            <p>{message.msg} {message.user}</p>))}
        </div>
        :
        <div>
          <input type="text" id="user" placeholder='username' value={this.state.user} onChange={this.handleChange}></input>
          <button onClick={() => this.setState({isLoggedIn: true})}>login</button>
        </div>
        }
      </div>
    )
  }
};

ReactDOM.render(<App />, document.getElementById('app'));