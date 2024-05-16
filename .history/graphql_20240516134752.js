const { ApolloServer, gql } = require('apollo-server-lambda');
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    getUsers(payload:JSON): JSON
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    getUsers: async (parent, args, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.getItemsData(
          { db: 'tasksDB', collection: 'users', query: {  } }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        return data

      })
      return getData.then(data => data).catch((err) => console.log(err))
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  context: ({ event, context, express }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
    expressRequest: express.req,
  }),
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

exports.graphqlHandler = server.createHandler();