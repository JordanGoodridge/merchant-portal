const { Client } = require('pg');

const client = new Client({
	user: 'igstfgilrlyvry',
	host: 'ec2-34-192-173-173.compute-1.amazonaws.com',
	database: 'd5otfafr0g0sbe',
	password: 'f9318944658a2da09d59b74b0ebd8e5bfd0654f1ebc0e4ad5e1fedb0c98888f5',
	port: 5432,
	ssl: { rejectUnauthorized: false }
});

module.exports = client;
