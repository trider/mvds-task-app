// InState
const app = require('./app/app')
const tasks =  require('./tasks/tasks')
const users	=  require('./users/users')






module.exports = {
	Query: {
		...app.Query,
		...tasks.Query,
		...users.Query,
	},
	Mutation: {
		...app.Mutation,
		...tasks.Mutation,
		...users.Mutation,
	}
};