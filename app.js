require('dotenv').config();
const express = require("express");
const { createServer } = require('http');
const { execute, subscribe, buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const { importSchema } = require("graphql-import");
const { SubscriptionServer } = require('subscriptions-transport-ws');
const graphqlResolvers = require("./graphql/resolvers");
const mongoose = require("mongoose");

const PORT = 3000;
const subscriptionsEndpoint = `ws://localhost:${PORT}/subscriptions`;
const server = express();
const schema = buildSchema(importSchema("**/*.graphql"));
server.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: graphqlResolvers,
        endpointURL: '/graphql',
        graphiql: {
            subscriptionsEndpoint: subscriptionsEndpoint
        }
    })
);
const webServer = createServer(server);

const uri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
const options = { useNewUrlParser: true, useUnifiedTopology: true };


mongoose
    .connect(uri, options)
    .then(() => webServer.listen(PORT, () => {
        console.log(`GraphQL is now running on http://localhost:${PORT}`);

        // Set up the WebSocket for handling GraphQL subscriptions.
        new SubscriptionServer({
            execute,
            subscribe,
            schema
        }, {
            server: webServer,
            path: '/subscriptions',
        })
    }))
    .catch((error) => {
        throw error;
    });