const { verify } = require('jsonwebtoken');

const isAuth = (request, response, next) => {
	console.log('now checking the JWT');
	const givenToken = request.headers.authorization;

	if (!givenToken) {
		return response.json({ success: false, errorMessage: 'NO TOKEN' });
	}

	let verifiedToken;
	try {
		verifiedToken = verify(givenToken, 'secret');
	} catch (error) {
		return response.json({ success: false, errorMessage: 'PROBLEM VERIFYING TOKEN' });
	}

	if (!verifiedToken) {
		return response.json({ success: false, errorMessage: 'BAD TOKEN' });
	}

	request.email = verifiedToken.email;

	next();
};

module.exports = isAuth;
