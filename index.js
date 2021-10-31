const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//Database Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywgrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const database = client.db('vromonguru');
        const serviceCollection = database.collection('services');

        //POST API

        app.post('/services', async(req, res)=>{
            const service = req.body;
            console.log('hit post api', service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });


        //GET API
        app.get('/services', async(req, res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET Single Service API
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        //Delete API
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })

    }
   finally{

   } 
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("From Node")
});

app.listen(port, ()=>{
    console.log("Listening From: ", port)
})