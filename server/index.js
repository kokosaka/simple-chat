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
      })
    );
  }
};

wsServer.on("request", function (request) {
  var userID = getUniqueID();
  const connection = request.accept(null, request.origin);
  // console.log("connection!", connection);
  //store connection with generated userID
  clients[userID] = connection;
  console.log(
    "connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
  );
  connection.on("login", (message) => {
    console.log("logging IN!");
  });
  // newUserEntrance(*)

  var onlineUsers = Object.keys(clients).length;
  var userCount = JSON.stringify({
    type: "userCount",
    userCount: onlineUsers,
  });
  //on message handler, looping clients and forwarding message to them
  connection.on("message", function (message) {
    if (message.type === "utf8") {
      console.log("Received message: ", message.utf8Data);
      console.log("Received message: ", message);
      var jsonData = JSON.parse(message.utf8Data);
      if (jsonData.type === "login") {
        var user = jsonData.user;
        clients[userID].username = user;
        newUserEntrance(user);
      } else {
        for (key in clients) {
          clients[key].sendUTF(message.utf8Data);
          clients[key].sendUTF(userCount);
          // console.log('sent message to: ', clients[key]);
        }
      }
    }
  });

  connection.on("close", function (message) {
    for (key in clients) {
      clients[key].sendUTF(
        JSON.stringify({
          type: "message",
          msg: `has left the chat.`,
          user: clients[userID].username,
          color: "grey",
        })
      );
    }
    delete clients[userID];
  });
});
