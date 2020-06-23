var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;
var heroku_config = process.env.DATABASE_URL || "postgres://aczmbwlkixdtfq:e80bb0c9f8fcab36b3712ddbd4fe356981174d9c930c0f8c0202ae5c1165297e@ec2-3-216-129-140.compute-1.amazonaws.com:5432/d541m4me20fera";


app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(PORT, () => {
 console.log("Server running on port " + PORT);
});

var pg = require('pg');
var pool = new pg.Pool(heroku_config);

pool.connect(process.env.DATABASE_URL, function(err, client, done) {
  client.query('SELECT * FROM merchant', function(err, result) {
    done();
    if(err) return console.error(err);
    console.log(result.rows);
  });
});

