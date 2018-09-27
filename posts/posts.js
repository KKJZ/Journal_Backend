'use strict';
const express = require('express');
const router =  express.Router();

const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {JWT_SECERT} = require('../.config');
const {verify} = require('../scripts/verify');

const {Users} = require('../models/users');
const {Posts} = require('../models/posts');

//GET endpoint
router.get('/', verify, (res, req) => {
	jwt.verify(req.token, JWT_SECERT, (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			console.log(authData);
		}
	})
});

//POST endpoint
router.post()

//PUT endpoint
router.put()

//DELETE endpoint
router.delete()


module.exports = router;