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
	console.log(req.body);
	const requiredFields = ['userName', 'password'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i]
		if (!(field in req.body)) {
			const messege = `Request body missing ${field}`;
			console.log(messege);
			return res.sendStatus(400);	
		}
	}
	let {userName, password} = req.body;
	Users.findOne({'userName': userName}, (err, user) => {
		console.log(user);
		if (user === null) {
			console.log('inside if')
			//THIS IS THE PROBLEM IT DOESN'T END HERE
			return res.sendStatus(400);	 
		}
	})
	.then(val => {
		//check password to see if it is valid
		console.log(val);
		if (Users().validatePassword(password, val.password) === false) {
			return res.sendStatus(401);
		} else {
			//jwt token sign and send
			jwt.sign({userName}, JWT_SECERT, {expiresIn: '5m'}, (err, token) => {
				return res.json({token});
			})
		}
	})
	.catch(err => {
		console.log(err);
		return res.sendStatus(500);
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