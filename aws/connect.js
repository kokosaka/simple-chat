const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  await addClient(connectionId);
  const response = {
    statusCode: 200,
    body: JSON.stringify("client connected"),
  };
  return response;
};

const addClient = (connectionId) => {
  var params = {
    TableName: "simplechat-clients",
    Item: {
      connectionid: connectionId,
      info: {
        username: "",
      },
    },
  };
  return db
    .put(params, function (err, data) {
      if (err) {
        console.log("err storing to dynamoDB", JSON.stringify(err));
      } else {
        console.log("successful, client stored", JSON.stringify(data));
      }
    })
    .promise();
};
