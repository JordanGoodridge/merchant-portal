const { compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const client = require('../database/client');

const postLogin = async (request, response) => {
	const { email, password } = request.body;

	const feedback = await client.query('select * from customer where customer.email = $1', [ email ]);

	if (!feedback.rows.length) {
		return response.json({ success: false, errorMessage: 'EMAIL DOESNT EXIST' });
	}

	const valid = await compare(password, feedback.rows[0].password);

	if (!valid) {
		return response.json({ success: false, errorMessage: 'PASSWORD IS WRONG' });
	}

	const token = sign(
		{
			email
		},
		'secret'
	);

	response.json({ success: true, token });
};

module.exports = {
	postLogin
};
