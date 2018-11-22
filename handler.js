"use strict";

var mysql = require("promise-mysql");
const AWS = require("aws-sdk");

AWS.config.update({ region: process.env.REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.getApartments = async (event, context) => {
  console.log(event.requestContext.identity.cognitoIdentityId);
  console.log("go!");
  try {
    console.log("trying to connect...");
    let connection = await mysql.createConnection({
      host: "pineapplepad.cinjlaf9njkx.us-east-1.rds.amazonaws.com",
      password: "2dnUgP3IxB2O",
      user: "root",
      database: "rentals",
      connectTimeout: 3000
    });
    console.log("connected!");

    let queryParams = {
      TableName: "account_attributes"
      // KeyConditions: condition
    };

    dynamodb.query(queryParams, (err, data) => {
      if (err) {
        console.log("dynamodb error");
        console.log(err);
      } else {
        console.log("dynamodb success");
        console.log(data);
      }
    });

    try {
      let results = await connection.query(
        `SELECT * FROM rentals.apartments 
         INNER JOIN  buildings ON apartments.building_id=buildings.id;`
      );
      console.log("results:");
      console.log(results);
    } catch (err) {
      console.log("Error in query!");
      console.log(err);
    }

    // console.log(connection)
    // return "connected"
  } catch (err) {
    console.error(err);
    // return "error"
  }
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
      // connection: connection
    })
  };
};
