var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(PORT, () => {
 console.log("Server running on port " + PORT);
});

var pg = require('pg');

pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM merchant', function(err, result) {
    done();
    if(err) return console.error(err);
    console.log(result.rows);
  });
});