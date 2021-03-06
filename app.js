'use strict';
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

//dotenv
require('dotenv').config();

//import routes
const loginRouter = require('./login/login');
const registerRouter = require('./register/register');
const postRouter = require('./posts/posts');

//import .config
const {PORT, DATABASE_URL} =require('./.config');


const app = express();
//es6 promise
mongoose.Promise = global.Promise;

//CORS
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Methods', '*');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}
	next();
});

//logging with morgan
app.use(morgan('common'));

//endpoints
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/posts', postRouter);

let server;

function runServer (databaseURL, port = PORT) {
	return new Promise ((resolve, reject) => {
		mongoose.connect(databaseURL, { useNewUrlParser: true }, err => {
			if (err)
				return reject(err);
			})
		console.log(`connected to ${databaseURL}`);
		server = app.listen(port, () => {
			console.log(`Server is listening on PORT: ${port}`);
			resolve();
		})
		.on('error', err => {
			mongoose.disconnect()
			reject(err);
		})
	})
};

function closeServer () {
	return mongoose.disconnect().then(() => {
		return new Promise ((resolve, reject) => {
			console.log('Closing Server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		})
	});
};

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.log(err));
}

module.exports = {app, runServer, closeServer};