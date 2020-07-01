const jwt = require('jsonwebtoken');

console.log('running script');

const verifyToken = async () => {
	const verifiedToken = jwt.verify(
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFAZ21haWwuY29tIiwiaWF0IjoxNTkzNjMxODc4fQ.VEfR1NV2EH0IWQ0YHYa5KuvBIExu2fOoQ-RrKjPU6eU',
		'secret'
	);

	console.log(verifiedToken);
};

verifyToken();
