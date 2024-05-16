const config = require('../../config/config.json')
const { MongoClient, ObjectId } = require("mongodb");
const uri = config.urlMongo;



const {
  RESTDataSource
} = require('apollo-datasource-rest');



class MongoAPI extends RESTDataSource {
  constructor() {
    super()

  }

  async getItemData(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    const resp = await data.findOne(args.query).then(res => {
      return res
    }).catch(error => {
      console.log(error)
      // return {status:error}
    });
    await client.close()
    return resp
      
  }
  // fix
  async getItemDataByID(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    // 
    let qry = {}
    qry[args.field] = ObjectId(args.id)
    const resp = await data.findOne(qry).then(res => {
      // //console.log(res);
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
   
    
 
    
  }

  async getItemObjectsByID(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    
    let qry = {}
    qry[args.field] = ObjectId(args.id)
    const options = { sort: {  } };
    const resp = await data.find(qry, options).toArray().then(res => {
      //console.log(res);
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
   
    
 
    
  }


  async getItemsData(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: false });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    const options = { sort: {  } };
    const resp = await data.find(args.query, options).toArray().then(res => {
      //console.log(res);
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp

  }

  async getDistinctData(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    const resp = await data.getCollection(args.collection).distinct(args.value).then(res => {
      //console.log(res);
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
   
    
  
    
  }

  async writeItemData(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    const resp = await data.insertOne(args.data).then(res => {
      //console.log(res);
      return res.ops
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp


    
  }

  async writeItemsData(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const options = { ordered: true };
    const data = database.collection(args.collection);
    const resp =  await data.insertMany(args.data, options).then(res => {
      return res.ops
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
    
  }

  async replaceItemData(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    const resp = await data.replaceOne(args.query, args.payload).then(res => {
      client.close()
      return res.ops

    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
    
  }



  async updateItemData(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    const resp = await data.updateOne(
      args.query, { $set: args.data }, { upsert: true }     
    ).then(res => {
      client.close()
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
    
  }

  async updateItemDataId(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    let qry = {}
    qry[args.field] = ObjectId(args.id)
    // console.log(qry)
    const resp = await data.updateOne(
      qry, { $set: args.data }  ,{ upsert: false }
    ).then(res => {
      console.log(res.result)
      client.close()
      return res.result
    }).catch(error => {
      console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
    
  }

  async updateItemsData(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    let qry = {}
    qry[args.field] = ObjectId(args.id)
    const resp = await data.updateMany( args.query, { $set: args.data },{ upsert: true } ).then(res => {
      client.close()
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
    
  }

  async updateItemsDataId(args) {
    console.log(args)
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    let qry = {}
    qry[args.field] = ObjectId(args.id)
    const resp = await data.updateMany( args.query, { $set: args.payload.data },{ upsert: true } ).then(res => {
      client.close()
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    console.log(resp)
    return resp
    
  }



  async deleteItemData(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    const resp = await data.deleteOne(args.query).then(res => {
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
    
  }
  async deleteItemDataId(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    let qry = {}
    qry[args.field] = ObjectId(args.id)
    const resp = await data.deleteOne(args.query).then(res => {
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
    
  }

  async deleteItemsData(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    const resp =  await data.deleteMany(args.query).then(res => {
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
    
  }

  async deleteItemsDataId(args) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const database = client.db(args.db);
    const data = database.collection(args.collection);
    let qry = {}
    qry[args.field] = ObjectId(args.id)
    const resp =  await data.deleteMany(args.query).then(res => {
      return res
    }).catch(error => {
      //console.log(error)
      return {status:error}
    });
    await client.close()
    return resp
    
  }



 



}

module.exports = MongoAPI;
