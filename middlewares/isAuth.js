const jwt = require('jsonwebtoken');

const isAuth = (request, response, next) => {
	let givenToken = request.headers.authorization.split(' ')[1];

	console.log(givenToken);
	console.log(typeof givenToken);
	console.log('token is', JSON.stringify(givenToken));

	if (!givenToken) {
		return response.json({ success: false, errorMessage: 'NO TOKEN' });
	}

	let verifiedToken;
	try {
		verifiedToken = jwt.verify(givenToken, 'secret');
	} catch (error) {
		return response.json({ success: false, errorMessage: 'PROBLEM VERIFYING TOKEN' });
	}

	if (!verifiedToken) {
		return response.json({ success: false, errorMessage: 'BAD TOKEN' });
	}

	console.log(verifiedToken);
	console.log(verifiedToken.email);

	request.email = verifiedToken.email;

	next();
};

module.exports = isAuth;
