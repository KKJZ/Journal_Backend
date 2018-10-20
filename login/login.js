'use strict';
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {JWT_SECERT} = require('../.config');
const {verify} = require('../scripts/verify');

//import models
const {Users} = require('../models/users');

router.post('/', jsonParser, (req, res) => {
	//needed fields
	const requiredFields = ['userName', 'password'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i]
		if (!(field in req.body)) {
			const messege = `Request body missing ${field}`;
			console.log(messege);
			return res.status(400).send(messege);	
		}
	}
	let {userName, password} = req.body;
	let passTest;
	// make sure the user name is valid
	Users.findOne({'userName': userName}, (err, user) => {
		if (user === null) {
			return res.status(400).send('User not found.');
		}
		return passTest = Users().validatePassword(password, user.password); 
	})
	.then(val => {
		//check password to see if it is valid
		if (passTest === false) {
			res.status(400).send('Wrong password');
		} else {
			//jwt token sign and send
			jwt.sign({userName}, JWT_SECERT, {expiresIn: '5m'}, (err, token) => {
				console.log(err);
				res.json({token});
			})
		}
	})
	.catch(err => {
		return res.status(500).send('Something happened.');
	})
});

//refresh endpoint
router.post('/refresh', verify, jsonParser, (req, res) => {
	jwt.verify(req.token, JWT_SECERT, (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			jwt.sign({userName: authData.userName}, JWT_SECERT, {expiresIn: '5m'}, (err, token) => {
				res.json({token});
			})
		}
	})
});
module.exports = router;