var express = require("express");
const bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 3000;

const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://aczmbwlkixdtfq:e80bb0c9f8fcab36b3712ddbd4fe356981174d9c930c0f8c0202ae5c1165297e@ec2-3-216-129-140.compute-1.amazonaws.com:5432/d541m4me20fera",
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, () => {
 console.log("Server running on port " + PORT);
});

app.get('/', function(request, response) {
	response.send('Hello World!');
});

app.post("/merchant-signup", function(request, response) {
	var new_merchant = request.body;
	console.log(request.body.email);


	client.query('SELECT * FROM merchant;', (err, res) => {
  	if (err) throw err;
	  for (let row of res.rows) {
	    console.log(JSON.stringify(row));
	  }
	  client.end();
	});
	result.send("Account created")
});





