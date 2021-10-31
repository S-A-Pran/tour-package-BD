const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ftrdn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log('connected to db')
      const database = client.db("holiday_guide");
      const packages = database.collection("packages");
      const blogs = database.collection("blogs");
      const orders = database.collection("orders");

      app.get('/packages', async(req, res) => {
          const cursor = packages.find({});
          const allPackages = await cursor.toArray();
          res.json(allPackages);
          console.log("sended");
      })

      app.get('/packages/:id', async(req, res) => {
          const id = req.params.id;
          console.log(id);
          const cursor = await packages.findOne({_id: ObjectId(id)});
          res.json(cursor);
          console.log("sended", cursor);
      })

      app.get('/blogs', async(req, res) => {
          const cursor = blogs.find({});
          const allBlogs = await cursor.toArray();
          res.json(allBlogs);
          console.log("sended");
      })

      app.get('/myorders/:email', async(req, res) => {
          const email = req.params.email;
          const query = {email: email};
          const cursor = orders.find(query);
          const order = await cursor.toArray();
          res.json(order);
      })

      app.get('/allorders', async(req, res) => {
          const query = orders.find({});
          const allorder = await query.toArray();
          res.json(allorder);
      })

      app.delete('/myorders', async(req, res) => {
          const id = req.query.search;
          const query = {_id: ObjectId(id)};
          const cursor = await orders.deleteOne(query);
          res.json(cursor);
      })

      app.post('/order/:id', async(req, res) => {
          const user = req.body;
          console.log(user);
          const result = await orders.insertOne(user);
          res.json(result);
      })

      app.post('/packages', async(req, res) => {
          const data = req.body;
          const result = await packages.insertOne(data);
          res.json(result);
          console.log(result);
      })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send("tour server");
    console.log("hitting get");
})

app.listen(port, () =>{
    console.log('listening to port', port);
})


