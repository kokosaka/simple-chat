const port = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

//.createServer creates an HTTP server object,
const server = http.createServer().listen(port);
console.log('listening on port 8000');

const wsServer = new webSocketServer({
  httpServer: server
});

const clients = {};

const getUniqueID = () => {
  const s4 = () => Math.floor((1+Math.random())* 0x10000).toString(16).toString(1);
  return s4()+s4()+'-'+s4();
}

wsServer.on('request', function(request) {
  var userID = getUniqueID();
  // console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.');

  const connection = request.accept(null, request.origin);

  //store connection with generated userID
  clients[userID] = connection;
  // console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

  //on message handler, looping clients and forwarding message to them
  connection.on('message', function(message) {
    if(message.type === 'utf8') {
      // console.log('Received message: ', message.utf8Data);

      for(key in clients) {
        clients[key].sendUTF(message.utf8Data);
        // console.log('sent message to: ', clients[key]);
      }
    }
  })
});