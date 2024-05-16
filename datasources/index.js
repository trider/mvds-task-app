const { MongoClient } = require('mongodb');

const MongoAPI = require('./mongo/mongo');




const DataSources = () => {
	return {
		mongoAPI: new MongoAPI(),
	}
}

module.exports = DataSources;