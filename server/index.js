const port = 8000;
const webSocketServer = require("websocket").server;
const http = require("http");

//.createServer creates an HTTP server object,
const server = http.createServer().listen(port);
console.log("listening on port 8000");

const wsServer = new webSocketServer({
  httpServer: server,
});

const clients = {};
// var onlineUsers = Object.keys(clients).length;

wsServer.on("request", function (request) {
  var userID = getUniqueID();
  const connection = request.accept(null, request.origin);
  console.log("request origin", request.origin);
  clients[userID] = connection;

  //on message handler, looping clients and forwarding message to them
  //if the utfdata is of type login, store the username into the userID object, then send all clients a message that a new user has entered
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      var data = JSON.parse(message.utf8Data);
      if (data.type === "login") {
        var user = data.user;
        clients[userID].username = user;
        newUserEntrance(user);
      } else {
        for (key in clients) {
          data.userCount = Object.keys(clients).length;
          clients[key].sendUTF(JSON.stringify(data));
        }
      }
    }
  });

  //when connection closes, send all clients a message that this client is leaving,
  //then delete client from clients object
  connection.on("close", function (message) {
    var username = clients[userID].username;
    delete clients[userID];

    for (key in clients) {
      clients[key].sendUTF(
        JSON.stringify({
          type: "message",
          msg: `has left the chat.`,
          user: username,
          color: "grey",
          userCount: Object.keys(clients).length,
        })
      );
    }
  });
});

//helper functions
const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .toString(1);
  return s4() + s4() + "-" + s4();
};

const newUserEntrance = (username) => {
  for (key in clients) {
    clients[key].sendUTF(
      JSON.stringify({
        type: "message",
        msg: `has entered the chat.`,
        user: username,
        color: "grey",
        userCount: Object.keys(clients).length,
      })
    );
  }
};
