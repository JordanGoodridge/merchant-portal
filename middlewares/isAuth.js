const jwt = require('jsonwebtoken');

const isAuth = (request, response, next) => {
	const givenToken = request.headers.authorization;
	console.log(givenToken);
	console.log('token is', JSON.stringify(givenToken));

	if (!givenToken) {
		return response.json({ success: false, errorMessage: 'NO TOKEN' });
	}

	const verifiedToken = jwt.verify(givenToken, 'secret');
	// try {
	// 	verifiedToken = jwt.verify(givenToken, 'secret');
	// } catch (error) {
	// 	return response.json({ success: false, errorMessage: 'PROBLEM VERIFYING TOKEN' });
	// }

	if (!verifiedToken) {
		return response.json({ success: false, errorMessage: 'BAD TOKEN' });
	}

	console.log(verifiedToken);
	console.log(verifiedToken.email);

	request.email = verifiedToken.email;

	next();
};

module.exports = isAuth;
