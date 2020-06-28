const { hash } = require('bcryptjs');
const client = require('../database/client');

const postRegister = async (request, response) => {
	const { email, password } = request.body;
	console.log('request body', email, password);

	try {
		const feedback = await client.query('select * from customer where customer.email = $1', [ email ]);
		console.log(feedback.rows);

		if (feedback.rows.length) {
			return response.json({ success: false, errorMessage: 'EMAIL ALREADY EXISTS' });
		}
	} catch (error) {
		return response.json({ success: false, errorMessage: 'FAILED TO QUERY FIND DATABASE' });
	}

	const hashedPassword = await hash(password, 12);

	try {
		await client.query('insert into customer(email, password) values($1, $2)', [ email, hashedPassword ]);
	} catch (error) {
		return response.json({ success: false, errorMessage: 'FAILED TO QUERY INSERT DATABASE' });
	}

	console.log('PASSED REGISTER VALIDATION');
	response.json({ success: true });
};

const getRegister = (request, response) => {
	response.json({ message: 'REGISTER GET' });
};

module.exports = {
	postRegister,
	getRegister
};
