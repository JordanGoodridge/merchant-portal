var express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

var app = express();
const PORT = process.env.PORT || 3000;

const { Pool, Client } = require('pg')

const client = new Client({
	user: 'igstfgilrlyvry',
	host: 'ec2-34-192-173-173.compute-1.amazonaws.com',
	database: 'd5otfafr0g0sbe',
	password: 'f9318944658a2da09d59b74b0ebd8e5bfd0654f1ebc0e4ad5e1fedb0c98888f5',
	port: 5432,
	ssl: { rejectUnauthorized: false }
  })
  client.connect()

// const pool = new Pool({
// 	user: 'aczmbwlkixdtfq',
// 	host: 'ec2-3-216-129-140.compute-1.amazonaws.com',
// 	database: 'd541m4me20fera',
// 	password: 'e80bb0c9f8fcab36b3712ddbd4fe356981174d9c930c0f8c0202ae5c1165297e',
// 	port: 5432,
// 	ssl:true,
// })

// const client = new Client({
//   connectionString: "postgres://aczmbwlkixdtfq:e80bb0c9f8fcab36b3712ddbd4fe356981174d9c930c0f8c0202ae5c1165297e@ec2-3-216-129-140.compute-1.amazonaws.com:5432/d541m4me20fera",
//   ssl: {
//     rejectUnauthorized: false
//   }
// });


client.query('SELECT * FROM merchant;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
 console.log("Server running on port " + PORT);
});

app.get('/', function (req, res, next) {
  res.render('index', { title: 'Front Page' });
});



app.post("/merchant-signup", function(request, response) {
	var new_merchant = request.body;
	var signup_query = "INSERT INTO merchant (name, longitude, latitude, email, password) VALUES ('" + request.body.store_name + "','" + request.body.longitude + "','" + request.body.latitude + "','" + request.body.email + "','" + request.body.password + "');"
	console.log(signup_query);
	client.query(signup_query, (err, res) => {
  	if (err) throw err;
	  for (let row of res.rows) {
	    console.log(JSON.stringify(row));
	  }
	});
	response.send("Account created");
});

app.post("/merchant-login", function(request, response) {
	var new_merchant = request.body;
	var login_query = "SELECT email FROM merchant WHERE email='" + request.body.email + "'AND password='" + request.body.password + "';";
	console.log(login_query);	
	client.query(login_query, (err, res) => {
  	if (err) throw err;
  	  console.log(res);	
	  if(res.rowCount == 0){
	  	response.json({success: false});		
	  }
	  else{
		  for (let row of res.rows) {
		    console.log(JSON.stringify(row));
		  }
		  response.json( {success: true, email: request.body.email});		
	  }
	});
});

//TO ADD: app.get("/get-merchant-items", function(request, response) {



app.post("/get-merchant-items", function(request, response) {
	var new_merchant = request.body;
	var login_query = "SELECT merch_id,name,price FROM catalogue WHERE merch_id=" + request.body.merch_id + ";";
	console.log(login_query);	
	client.query(login_query, (err, res) => {
  	if (err) throw err;
  	  console.log(res);	
	  if(res.rowCount == 0){
	  	response.json({success: false});		
	  }
	  else{
		  for (let row of res.rows) {
		    var jsonRow = (JSON.stringify(row))
		    console.log(jsonRow);	
		    var jsonObject = Object.assign(jsonObject, jsonRow);
		  }
		  console.log(jsonRow);
		  response.json( {success: true, email: request.body.email});		
	  }
	});
});

app.post("/merchant-add-item", function(request, response) {
	var new_merchant = request.body;
	var login_query = "INSERT INTO catalogue (name, price, merch_id) VALUES ('" + request.body.item + "','" + request.body.price + "','" + request.body.merch_id + "');";
	console.log(login_query);	
	client.query(login_query, (err, res) => {
  	if (err) throw err;
	  for (let row of res.rows) {
	    console.log(JSON.stringify(row));
	  }
	});
	response.send("Item added");	
});





