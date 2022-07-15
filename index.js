const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
// const nodemailer = require('nodemailer');
// const mandrillTransport = require('nodemailer-mandrill-transport');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3lazc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized access" });
  }
  const token = authHeader.split(" ")[1];
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("photography").collection("services");
    const userCollection = client.db("photography").collection("users");

    app.put("/user/:email", async (req, res) => {
      const email = req.body.email;
    //   console.log(email);
      // console.log(process.env.ACCESS_TOKEN_SECRET)
      // const user = req.body;
      const user = req.body;
      console.log(user);
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET
       
      );
      res.send({ result, token });
    });

    app.put("/login",  async (req, res) => {
      const user = req.query.user;
      const query= { email: req.query.user }
      const token = jwt.sign(
        { email: user },
        process.env.ACCESS_TOKEN_SECRET
       
      );
      
      // const decodedEmail = req.decoded.email;
    
      
      const dbuser = await userCollection.findOne(query)
      console.log(dbuser)
    
    
      if (user==dbuser.email) {
       
        res.status(200).json({ success: true, email: user, token});
      } 
      else {
        res.status(403).send("wrong email");
      }
    });

    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World from server!");
});

app.listen(port, () => {
  console.log(`photograpgy app listening on port ${port}`);
});
