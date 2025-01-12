// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');
const dataSources = require('./datasources');
const { ObjectID } = require('mongodb');

const typeDefs = gql`

  scalar JSON
  type Query {
    # Users
    getUsers(payload:JSON): JSON
    getUser(payload:JSON): JSON

    # Tasks
    getTasks(payload:JSON): JSON
    getTask(payload:JSON): JSON
  
  }
  type Mutation {
  
    # Users
    login(payload:JSON): JSON
    createUser(payload:JSON): JSON
    updateUser(payload:JSON): JSON
    deleteUser(payload:JSON): JSON
    unDeleteUser(payload:JSON): JSON

    # Tasks
    createTask(payload:JSON): JSON
    updateTask(payload:JSON): JSON
    deleteTask(payload:JSON): JSON
    deleteAllTasks(payload:JSON): JSON
    unDeleteAllTasks(payload:JSON): JSON
    unDeleteTask(payload:JSON): JSON
  
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    getUsers: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.getItemsData(
          { db: 'tasksDB', collection: 'users', query: {} }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        return data

      })
      return getData.then(data => data).catch((err) => console.log(err))
    },
    getUser: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'users', query: { "userName": args.payload.userName } }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        return data

      })
      return getData.then(data => data).catch((err) => console.log(err))
    },
    getTasks: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.getItemsData(
          { db: 'tasksDB', collection: 'tasks', query: { user: args.payload.user, isActive: true } }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        return data

      })
      return getData.then(data => data).catch((err) => console.log(err))
    },
    getTask: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'tasks', query: { taskId: 1 } }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        return data

      })
      return getData.then(data => data).catch((err) => console.log(err))
    },
  },
  Mutation: {
    // User
    login: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'users', query: { "email": args.payload.email, "password": args.payload.password } }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        if (data !== null) {
          return {
            ...data,
            status: "User found",
            isAuthenticated: true
          }

        }
        else {
          return {
            status: "User not found",
            isAuthenticated: false
          }
        }

      })
      return getData.then(data => data).catch((err) => console.log(err))
    },
    createUser: async (parent, args, { dataSources }, context) => {
      let users = null
      let userId = null
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.getItemsData(
          { db: 'tasksDB', collection: 'users', query: {} }
        ).then((data, err) => resolve(data))

      }).then((data) => {
        users = data
        userId = users.length + 1
        return dataSources.mongoAPI.writeItemData({
          db: 'tasksDB',
          collection: 'users',
          data: {
            ...args.payload,
            userId: userId,
            created: new Date(),
            updated: new Date(),
            isActive: true

          }
        })
      }).then((data) => {
        return dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'users', query: { "userId": userId } }
        )
      })
      return getData.then(data => data).catch((err) => {
        console.log(err)
      })
    },
    updateUser: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.updateItemData(
          {
            db: 'tasksDB',
            collection: 'users',
            query: { "_id": ObjectID(args.payload.id) },
            data: args.payload.data
          }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        console.log(data.result)
        return dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'users', query: { "_id": ObjectID(args.payload.id) } }
        )
      })
      return getData.then(data => data).catch((err) => {
        console.log(err)
      })
    },
    deleteUser: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.updateItemData(
          {
            db: 'tasksDB',
            collection: 'users',
            query: { "_id": ObjectID(args.payload.id) },
            data: {
              isActive: false,
              updated: new Date()
            }
          }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        console.log(data.result)
        return dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'users', query: { "_id": ObjectID(args.payload.id) } }
        )
      })
      return getData.then(data => data).catch((err) => {
        console.log(err)
      })
    },
    unDeleteUser: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.updateItemData(
          {
            db: 'tasksDB',
            collection: 'users',
            query: { "_id": ObjectID(args.payload.id) },
            data: {
              isActive: true,
              updated: new Date()
            }
          }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        console.log(data.result)
        return dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'users', query: { "_id": ObjectID(args.payload.id) } }
        )
      })
      return getData.then(data => data).catch((err) => {
        console.log(err)
      })
    },
    // Tasks
    createTask: async (parent, args, { dataSources }, context) => {
      let tasks = null
      let taskId = null
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.getItemsData(
          { db: 'tasksDB', collection: 'tasks', query: {} }
        ).then((data, err) => resolve(data))

      }).then((data) => {
        tasks = data
        taskId = tasks.length + 1
        return dataSources.mongoAPI.writeItemData({
          db: 'tasksDB',
          collection: 'tasks',
          data: {
            ...args.payload,
            taskId: taskId,
            added: new Date(),
            updated: new Date(),
            isActive: true

          }
        })
      }).then((data) => {
        return dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'tasks', query: { "taskId": taskId } }
        )
      })
      return getData.then(data => data).catch((err) => {
        console.log(err)
      })
    },
    updateTask: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.updateItemData(
          {
            db: 'tasksDB',
            collection: 'tasks',
            query: { "_id": ObjectID(args.payload.id) },
            data: args.payload.data
          }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        console.log(data.result)
        return dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'tasks', query: { "_id": ObjectID(args.payload.id) } }
        )
      })
      return getData.then(data => data).catch((err) => {
        console.log(err)
      })

    },
    deleteTask: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.updateItemData(
          {
            db: 'tasksDB',
            collection: 'tasks',
            query: { "_id": ObjectID(args.payload.id) },
            data: {
              isActive: false,
              updated: new Date()
            }
          }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        console.log(data.result)
        return dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'tasks', query: { "_id": ObjectID(args.payload.id) } }
        )
      })
      return getData.then(data => data).catch((err) => {
        console.log(err)
      })
    },
    deleteAllTasks: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.updateItemsData(
          {
            db: 'tasksDB',
            collection: 'tasks',
            query: { "user": args.payload.user, "isActive": true },
            data: {
              isActive: false,
              updated: new Date()
            }
          }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        console.log(data.result)
        return dataSources.mongoAPI.getItemsData(
          { db: 'tasksDB', collection: 'tasks', query: { "user": args.payload.user } }
        )
      })
      return getData.then(data => data).catch((err) => {
        console.log(err)
      })
    },
    unDeleteTask: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.updateItemData(
          {
            db: 'tasksDB',
            collection: 'tasks',
            query: { "_id": ObjectID(args.payload.id) },
            data: {
              isActive: true,
              updated: new Date()
            }
          }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        console.log(data.result)
        return dataSources.mongoAPI.getItemData(
          { db: 'tasksDB', collection: 'tasks', query: { "_id": ObjectID(args.payload.id) } }
        )
      })
      return getData.then(data => data).catch((err) => {
        console.log(err)
      })
    },
    unDeleteAllTasks: async (parent, args, { dataSources }, context) => {
      const getData = new Promise((resolve) => {
        dataSources.mongoAPI.updateItemsData(
          {
            db: 'tasksDB',
            collection: 'tasks',
            query: { "user": args.payload.user, "isActive": false },
            data: {
              isActive: true,
              updated: new Date()
            }
          }
        ).then((data, err) => resolve(data))
      }).then((data) => {
        console.log(data.result)
        return dataSources.mongoAPI.getItemsData(
          { db: 'tasksDB', collection: 'tasks', query: { "user": args.payload.user } }
        )
      })
      return getData.then(data => data).catch((err) => {
        console.log(err)
      })
    },

  }

};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: dataSources,
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