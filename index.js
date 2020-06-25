var express = require("express");
var app = express();
const locate = require('./location');
//locate.test("YOOOO", "MANNNN");

const bodyParser = require("body-parser");
const path = require('path');
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






client.connect()

client.query('SELECT * FROM merchant;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
});



// 	gc signUp(user_name, user_email ,user_pass, user_street, user_city, user_state, user_zip)
// let payload = {
// 	name: userName,
// 	email: userEmail,
// 	pass: userPass,
// 	store: userStore,
// 	street: userStreet,
// 	city: userCity,
// 	state: userState,
// 	zip: userZip
// };

app.post("/merchant-signup", function(request, response) {
	var new_merchant = request.body;
	
	locate.getCoords(`${request.body.street} ${request.body.city} ${request.body.state} ${request.body.zip}`).then(res => {
		console.log(res.lat);
		console.log(res.lng);
		// var lat = res[lat];
		// var long = res[lng];
		// console.log(lat + " " + long);
	
		var signup_query = "INSERT INTO merchant (name, longitude, latitude, email, password) VALUES ('" + request.body.store + "','" + res.lng+ "','" + res.lat + "','" + request.body.email + "','" + request.body.pass + "');"
		console.log(signup_query);
		client.query(signup_query, (err, res) => {
		if (err) throw err;
		for (let row of res.rows) {
			console.log(JSON.stringify(row));
		}
		});
		response.sendStatus(200)

	});


});

//Takes merchant email and password. Returns merch_id if successfull. returns 404 if failed
app.post("/merchant-login", function(request, response) {
	var new_merchant = request.body;
	var login_query = "SELECT merch_id FROM merchant WHERE email='" + request.body.email + "'AND password='" + request.body.password + "';";
	console.log(login_query);	
	client.query(login_query, (err, res) => {
  	if (err) throw err;
  	  console.log(res);	
	  if(res.rowCount == 0){
		response.sendStatus(404)
	  }
	  else{
		  for (let row of res.rows) {
		    console.log(JSON.stringify(row));
    		output = JSON.stringify(row);	
		  }
		  console.log("Output:");
		  console.log(output)
		  response.status(200).json(output);		
	  }
	});
});

//Takes merch_id and returns array of json of merchant items. returns 404 if failed
app.get("/merchant-items", function(request, response) {
	var login_query = "SELECT item_id,merch_id,name,price FROM catalogue WHERE merch_id=" + request.query.merch_id + ";";
	console.log(login_query);	
	client.query(login_query, (err, res) => {
	  if(res.rowCount == 0){
		response.sendStatus(404)
		
	  }
	  else{
	  	  var count = 0
		  for (let row of res.rows) {
		  	if(count == 0){
		    	var jsonObj = [(JSON.stringify(row))]
		    	console.log(jsonObj);	
		    	count +=1
		  	}
		  	else{
			    var jsonRow = (JSON.stringify(row))
		    	jsonObj.push(jsonRow)
		  	}
		  }
		  console.log(jsonObj);
		  response.json(jsonObj);		
	  }
	});
});

//Pass item name, price and merch_id to add to merchant catalogue
app.post("/merchant-item", function(request, response) {
	var login_query = "INSERT INTO catalogue (name, price, merch_id) VALUES ('" + request.body.item + "','" + request.body.price + "','" + request.body.merch_id + "');";
	console.log(login_query);	
	client.query(login_query, (err, res) => {
  	if (err) throw err;
	  if(res.rowCount == 0){
		response.sendStatus(404)
	  }
	  for (let row of res.rows) {
	    console.log(JSON.stringify(row));
	  }
	});
	response.sendStatus(200)	
});


//Pass item_id and merch_id of item to delete from catalogue
app.delete("/merchant-item", function(request, response) {
	var login_query = "DELETE FROM catalogue WHERE item_id=" + request.body.item_id  + " AND merch_id=" + request.body.merch_id + ";"
	console.log(login_query);	
	client.query(login_query, (err, res) => {
  	if (err) throw err;
	  if(res.rowCount == 0){
		response.sendStatus(404)
		
	  }
	  for (let row of res.rows) {
	    console.log(JSON.stringify(row));
	  }
	});
	response.sendStatus(200)	
});






