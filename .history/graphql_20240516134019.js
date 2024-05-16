// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const typeDefs = require('./schema/schema');
const resolvers = require('./resolvers/resolvers');


const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

exports.graphqlHandler = server.createHandler();