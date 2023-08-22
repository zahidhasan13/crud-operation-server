const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

// userName = zahidhasanofficial13
// Password = XgAYXmVV88BtnqII



const uri = "mongodb+srv://zahidhasanofficial13:XgAYXmVV88BtnqII@cluster0.sjxc9jf.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("usersDB").collection("users");


    app.get('/users', async(req, res) => {
        const cursor = usersCollection.find()
        const users = await cursor.toArray();
        res.send(users);
    })

    app.get('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const user = await usersCollection.findOne(query);
        res.send(user);
    })

    app.post('/users', async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await usersCollection.insertOne(user);
        res.send(result);
    })

    app.put('/users/:id', async (req, res) => {
        const id = req.params.id;
        const user = req.body;
        const query = {_id: new ObjectId(id)};
        const option = {upsert: true};
        const updatedUser = {
            $set:{
                name: user.name,
                email: user.email
            }
        }
        const result = await usersCollection.updateOne(query, updatedUser, option);
        res.send(result);   

    })

    app.delete('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await usersCollection.deleteOne(query);
        res.send(result);
    });






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Mongodb is running');
});



app.listen(port,() => {
    console.log(`Server running on port ${port}`);
});

