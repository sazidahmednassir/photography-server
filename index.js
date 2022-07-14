const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')

require('dotenv').config();

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3lazc.mongodb.net/?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
  res.send('Hello World from server!')
})

app.listen(port, () => {
  console.log(`photograpgy app listening on port ${port}`)
})