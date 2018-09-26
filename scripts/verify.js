exports.verify = function verifyToken(req, res, next) {	
	//get auth header
	const bearerHeader = req.headers['authorization'];
	// check if bearer is undefined
	if (typeof bearerHeader !== 'undefined') {
		//split at space
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		//set token
		req.token = bearerToken;
		next();
	} else {
		//forbidden
		res.sendStatus(403);
	}
};