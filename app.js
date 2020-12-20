require('dotenv').config();
const express = require("express");
const {buildSchema} = require("graphql");
const {graphqlHTTP} = require("express-graphql");
const { importSchema } = require("graphql-import");
const graphqlResolvers = require("./graphql/resolvers");
const mongoose = require("mongoose");
const server = express();
server.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(importSchema("**/*.graphql")),
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);
// const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-uox7n.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const uri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(uri, options)
  .then(() => server.listen(3000, console.log("Server is running")))
  .catch((error) => {
    throw error;
  });
