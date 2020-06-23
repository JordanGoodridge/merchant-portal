var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT * FROM merchant;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(PORT, () => {
 console.log("Server running on port " + PORT);
});



