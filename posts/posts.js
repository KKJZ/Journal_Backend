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

//GET token required endpoint
router.get('/', verify, (req, res) => {
	jwt.verify(req.token, JWT_SECERT, (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			console.log(authData);
			let {userName} = authData;
			console.log(`userName: ${userName}`);
			Posts.find()
			.then(posts => {
				res.json(posts.map(post => post.serialize()));
			})
			.catch(err => {
				console.error(err);
				res.status(500).json({error: 'Something happened.'});
			})
		}
	})
});

//POST endpoint
router.post('/', verify, jsonParser, (req, res) => {
	jwt.verify(req.token, JWT_SECERT, (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			console.log(authData);
			let {userName} = authData;
			console.log(`userName: ${userName}`);
			//what fields do we need to make a post? date, content, userName
			const requiredFields =  ["content"];
			for (let i = 0; i<requiredFields.length; i++) {
				const field = requiredFields[i];
				if (!(field in req.body)) {
						const messege = `Request body is missing ${field}`;
						console.error(messege);
						return res.stats(400).send(messege);
				};
			};
			let {content} = req.body;
			const item = Posts.create({
				date: Date.now(),
				content,
				userName
			})
			.then(post => res.status(201).json(post.serialize()))
			.catch(err => {
				console.error(err);
				res.status(500).json({error: 'Something happened.'})
			})
		}
	})
})

//PUT endpoint
router.put('/:id', verify, jsonParser, (req, res) => {
	jwt.verify(req.token, JWT_SECERT, (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			console.log(authData);
			let {userName} =  authData;
			console.log(`userName: ${userName}`);
			//can only update content
			const update = {content: req.body.content};
			Posts.findByIdAndUpdate(req.params.id, {$set: update}, {new: true})
			.then(updatedPost => res.status(204).end())
			.catch(err => {
				console.error(err);
				res.status(500).json({erorr: 'Something happened.'})
			})
		}
	})
})

//DELETE endpoint
router.delete('/:id', verify, jsonParser, (req, res) => {
	jwt.verify(req.token, JWT_SECERT, (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			console.log(authData);
			let {userName} = authData;
			console.log(`userName: ${userName}`);
			Posts.findByIdAndRemove(req.params.id)
			.then(() => {
				res.status(204).json({messege: "Success!"})
			})
			.catch(err => {
				console.error(err);
				res.status(500).json({error: 'Something happened.'})
			})
		}
	})
})


module.exports = router;