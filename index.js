var express = require("express");
const { Client } = require('pg');
var app = express();


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});


app.get("/", (req, res, next) => {
 res.json(["Tony"]);
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
});