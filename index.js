const { MongoClient } = require('mongodb');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

//middle wire
app.use(cors());
app.use(express.json());

const uri = `const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b4g6x.mongodb.net/myFirstDatabase?`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('carMechanic');
    const serviceCollection = database.collection('services');

    //GET API
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //GET Single Api
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.json(service);
    });

    //POST API
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.json(result);
    });

    // Delete API
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  console.log('hitting the database');
  res.send('here you go with your genius mechanics');
});

app.listen(port, () => {
  console.log('listeninig to the port', port);
});
