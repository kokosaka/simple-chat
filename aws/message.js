const AWS = require("aws-sdk");

//to be able to send data to api
const api = new AWS.ApiGatewayManagementApi({
  endpoint: "mgyyxh2zp3.execute-api.us-west-1.amazonaws.com/production",
});

const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  var body = JSON.parse(event.body);
  var msg = body.msg;
  if (msg.type === "login") {
    var user = msg.user;
    //store username in client of database
    await storeClient(user, connectionId);
    await newUserEntrance(user);
    console.log("client has logged in with username: ", user);
  } else {
    var clients = await getItems();
    await relayToClients(msg, clients);
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};

const storeClient = (username, connectionId) => {
  var params = {
    TableName: "simplechat-clients",
    Key: {
      connectionid: connectionId,
    },
    UpdateExpression: "set info.username = :u",
    ExpressionAttributeValues: {
      ":u": username,
    },
    ReturnValues: "UPDATED_NEW",
  };
  return db
    .update(params)
    .promise()
    .then((data) => {
      console.log("successful storing clients username", data);
    })
    .catch((err) => {
      console.log("err updating clients username", err);
    });
};

async function newUserEntrance(username) {
  const items = await getItems();
  const data = {
    type: "message",
    msg: `has entered the chat.`,
    user: username,
    color: "grey",
    userCount: items.Count,
  };
  await relayToClients(data, items);
}

const getItems = () => {
  var params = {
    TableName: "simplechat-clients",
  };
  return db
    .scan(params)
    .promise()
    .then((data) => {
      console.log("successful getting items from db", data);
      return data;
    })
    .catch((err) => {
      console.log("err in getting items from db", err);
    });
};
// async function userDisconnection(username) {
//     const data = {
//         type: "message",
//         msg: `has left the chat.`,
//         user: username,
//         color: "grey",
//         userCount: Object.keys(clients).length,
//     }
//     await relayToClients(data);
// }

async function relayToClients(data, clients) {
  var clients = clients.Items;
  for (var i = 0; i < clients.length; i++) {
    var connectionId = clients[i].connectionid;
    await replyToMessage(data, connectionId);
  }
}

const replyToMessage = (response, connectionId) => {
  const data = { message: response };
  const params = {
    ConnectionId: connectionId,
    Data: Buffer.from(JSON.stringify(data)),
  };
  return api
    .postToConnection(params)
    .promise()
    .then((data) => {
      console.log("posted to connection", data);
    })
    .catch((err) => {
      console.log("err in posting to connection", err);
    });
};
