const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  console.log("deleting client ", connectionId);
  await removeClient(connectionId);
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};

const removeClient = (connectionId) => {
  var params = {
    TableName: "simplechat-clients",
    Keys: {
      connectionid: connectionId,
    },
  };
  return db
    .delete(params, function (err, data) {
      if (err) {
        console.log("err attempting to delete client", JSON.stringify(err));
      } else {
        console.log("successfule deleting client", JSON.stringify(data));
      }
    })
    .promise();
};
