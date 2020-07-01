var express = require('express');
var app = express();
const locate = require('./location');
const geolib = require('geolib');
const cors = require('cors');
const client = require('./database/client');

const registerRouter = require('./routers/registerRouter');
const loginRouter = require('./routers/loginRouter');
const checkoutRouter = require('./routers/checkoutRouter');

//locate.test("YOOOO", "MANNNN");

const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/checkout', checkoutRouter);

app.listen(PORT, () => {
	console.log('Server running on port ' + PORT);
});

app.get('/', function(req, res, next) {
	res.render('index', { title: 'Front Page' });
});

client.connect();

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

app.post('/merchant-signup', function(request, response) {
	var new_merchant = request.body;

	locate
		.getCoords(`${request.body.street} ${request.body.city} ${request.body.state} ${request.body.zip}`)
		.then((res) => {
			console.log(res.lat);
			console.log(res.lng);
			// var lat = res[lat];
			// var long = res[lng];
			// console.log(lat + " " + long);

			var signup_query =
				"INSERT INTO merchant (name, longitude, latitude, email, password) VALUES ('" +
				request.body.store +
				"','" +
				res.lng +
				"','" +
				res.lat +
				"','" +
				request.body.email +
				"','" +
				request.body.pass +
				"');";
			console.log(signup_query);
			client.query(signup_query, (err, res) => {
				if (err) throw err;
				for (let row of res.rows) {
					console.log(JSON.stringify(row));
				}
			});
			response.sendStatus(200);
		});
});

//Takes merchant email and password. Returns merch_id if successfull. returns 404 if failed
app.post('/merchant-login', function(request, response) {
	var new_merchant = request.body;
	var login_query =
		"SELECT merch_id FROM merchant WHERE email='" +
		request.body.email +
		"'AND password='" +
		request.body.password +
		"';";
	console.log(login_query);
	client.query(login_query, (err, res) => {
		if (err) throw err;
		console.log(res);
		if (res.rowCount == 0) {
			response.sendStatus(404);
		} else {
			for (let row of res.rows) {
				console.log(JSON.stringify(row));
				output = JSON.stringify(row);
			}
			console.log('Output:');
			console.log(output);
			response.status(200).json(output);
		}
	});
});

//Takes merch_id and returns array of json of merchant items. returns 404 if failed
app.get('/merchant-items', function(request, response) {
	var login_query =
		'SELECT item_id,merch_id,name,price FROM catalogue WHERE merch_id=' + request.query.merch_id + ';';
	console.log(login_query);
	client.query(login_query, (err, res) => {
		if (res.rowCount == 0) {
			response.sendStatus(404);
		} else {
			var count = 0;
			const items = [];
			for (let row of res.rows) {
				// if (count == 0) {
				// 	var jsonObj = [ JSON.stringify(row) ];
				// 	console.log(jsonObj);
				// 	count += 1;
				// } else {
				// 	var jsonRow = JSON.stringify(row);
				// 	jsonObj.push(jsonRow);
				// }
				items.push(row);
			}
			console.log(items);
			response.json({ success: true, items });
		}
	});
});

//Pass item name, price and merch_id to add to merchant catalogue
app.post('/merchant-item', function(request, response) {
	var add_query =
		"INSERT INTO catalogue (name, price, merch_id) VALUES ('" +
		request.body.item +
		"','" +
		request.body.price +
		"','" +
		request.body.merch_id +
		"');";
	console.log(add_query);
	client.query(add_query, (err, res) => {
		if (err) throw err;
		if (res.rowCount == 0) {
			response.sendStatus(404);
		}
		for (let row of res.rows) {
			console.log(JSON.stringify(row));
		}
	});
	response.sendStatus(200);
});

//Pass item_id and merch_id of item to delete from catalogue
app.delete('/merchant-item', function(request, response) {
	var delete_query =
		'DELETE FROM catalogue WHERE item_id=' + request.body.item_id + ' AND merch_id=' + request.body.merch_id + ';';
	console.log(delete_query);
	client.query(delete_query, (err, res) => {
		if (err) throw err;
		if (res.rowCount == 0) {
			response.sendStatus(404);
		} else {
			response.sendStatus(200);
		}
		for (let row of res.rows) {
			console.log(JSON.stringify(row));
		}
	});
});

//gets merchants within 1000m takjes in long lat
app.get('/nearby-merchants', function(request, response) {
	console.log('input geo', request.query.latitude, request.query.longitude);

	var nearby_query = 'SELECT merch_id, name, longitude, latitude FROM merchant;';
	client.query(nearby_query, (err, res) => {
		if (err) throw err;
		if (res.rowCount == 0) {
			response.sendStatus(404);
		}
		var nearby_stores = [];
		for (let row of res.rows) {
			var jsonRow = JSON.stringify(row);
			var jsonObj = JSON.parse(jsonRow);
			var distance = geolib.getDistance(
				{ latitude: request.query.latitude, longitude: request.query.longitude },
				{ latitude: jsonObj.latitude, longitude: jsonObj.longitude }
			);
			console.log(row);
			console.log(distance);
			if (distance <= 20000) {
				nearby_stores.push(jsonObj);
			}
		}
		console.log(nearby_stores);
		response.json({ success: true, nearby_stores });
	});
	console.log(nearby_query);
	
});


<<<<<<< HEAD
//POST put in database merch_id, visa merch id, shared key, id

=======
//PUT put in database merch_id, visa merch id, shared key, id
>>>>>>> 255e55079bf5886d27a65d9673567635c23188ab
app.put('/merchant-setting', function(request, response) {
	var add_query = "UPDATE merchant SET visa_merchant_id='" + request.body.visa_merchant_id + "', key_id='" + request.body.key_id + "', shared_key='" + request.body.shared_key + "' WHERE merch_id='" + request.body.merch_id + "';"
	console.log(add_query);
	client.query(add_query, (err, res) => {
		if (err) throw err;
		for (let row of res.rows) {
			console.log(JSON.stringify(row));
		}
	});
	response.sendStatus(200);
});

//GET check if they have these values filled
app.get('/merchant-setting', function(request, response) {
	var add_query = "SELECT * FROM merchant WHERE merch_id='" + request.query.merch_id + "';"
	console.log(add_query);
	client.query(add_query, (err, res) => {
		for (let row of res.rows) {
			console.log(JSON.stringify(row))
			jsonRow = JSON.stringify(row);
			var jsonObj = JSON.parse(jsonRow);
			console.log(jsonObj.key_id);
			if (jsonObj.key_id == undefined || jsonObj.shared_key == undefined || jsonObj.visa_merchant_id == undefined){
				response.sendStatus(404);
			}
			else{
				response.sendStatus(200);
			}
		}
	});
});


async function innerLoop(transaction){
	return new Promise(function(resolve) {
	var items = []	
	client.query(transaction, (err2, res2) => {
		if (res2.rowCount == 0) {
			resolve(items)
		}
		else{
			for (let row of res2.rows) {
				items.push(row);	
			}
			//console.log(items)	
			resolve(items)
		}
		});
	});
}

async function getEmail(cust_id){
	return new Promise(function(resolve) {
	var query = 'SELECT email FROM customer WHERE cust_id=' + cust_id + ';'
	client.query(query, (err2, res2) => {
		if (res2.rowCount == 0) {
			resolve("")
		}
		else{
			for (let row of res2.rows) {
				//console.log(row.email)
				resolve(row.email)
			}
		}
		});
	});
}

//Pass merch_id of item to delete from catalogue
app.get('/transactions', async function(request, response) {
	var transaction = 'SELECT * FROM orders WHERE merch_id=' + request.query.merch_id + ';'
	console.log(transaction);
	client.query(transaction, async (err, res) => {
		var orders = [];
		for (let row_row of res.rows) {
			var row_test = row_row
			var transaction2 = 'SELECT * FROM orderitems WHERE order_id=' + row_row.order_id + ';'
			console.log(transaction2);
			email = await getEmail(row_row.cust_id);
			row_test['cust_id'] = email
			row_test['email'] = row_test['cust_id'];
			delete row_test.cust_id
			items = await innerLoop(transaction2);
			//console.log(items)
			row_test['items'] = items
			//console.log(row_test)
			orders.push(row_test);	
		}
		console.log(orders)
		response.json({ success: true, orders });
	});
});
