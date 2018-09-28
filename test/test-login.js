'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

//import models
const {Users} = require('../models/users');
const {Posts} = require('../models/posts')

//import server ops
const {app, runServer, closeServer} = require('../app');
const {TEST_DATABASE_URL} = require('../.config');

chai.use(chaiHttp);

//tear down db
function tearDownDb () {
	console.warn('Deleting Test Database');
	return mongoose.connection.dropDatabase();
};

describe('Journal Back-end, login endpoint', function() {
	before(function() {
		runServer(TEST_DATABASE_URL);
	});
	afterEach(function() {
		tearDownDb();
	});
	after(function() {
		closeServer();
	});
	//POST
	describe('POST log a user in', function() {
		it('Should return a token for a already made user', function() {
			let newUser = {
				userName: faker.internet.userName(),
				password: faker.internet.password()
			};
			return chai.request(app).post('/register').send(newUser)
			.then(function(res) {
				expect(res.body).to.have.key('token');
				expect(res.body.token).to.not.be.null
			})
			.then(function() {
				return chai.request(app).post('/login').send(newUser)
			})
			.then(function(res) {
				expect(res.body).to.have.key('token');
				expect(res.body.token).to.not.be.null
			})
		})
	})
	//REFRESH
})