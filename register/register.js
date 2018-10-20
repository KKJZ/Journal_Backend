const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const jwt = require('jsonwebtoken');
const {JWT_SECERT} = require('../.config');

//import model
const {Users} = require('../models/users');

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['userName', 'password'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const messege = `Request body is missing ${field}`;
			console.error(messege);
			return res.status(400).send(messege);
		}
	};
	let user = Users();
	let {userName, password} = req.body;
	return Users.find({userName})
		.countDocuments()
		.then(count => {
			if (count != 0) {
				const messege = "User name is already taken.";
				console.error(messege);
				res.status(400).send(messege);
			}
			//if user is not in db hash password
			return user.hashPass(password);
		})
		//serialize with hashed password
		.then(hash => {
			return Users.create({
				userName,
				password: hash
			})
		})
		.then(user => {
			console.log(JWT_SECERT);
			jwt.sign({userName}, JWT_SECERT, {expiresIn: '5m'}, (err, token) => {
				res.json({token})
			})
		})
		.catch(err => {
			res.status(500).json({error: 'Something happened.'})
		})
});
module.exports = router;