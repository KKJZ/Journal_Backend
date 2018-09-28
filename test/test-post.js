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

//make a post
function generatePostData () {
	const data = {
		content: faker.lorem.paragraph()
	};
	return data;
};

//make user account
function generateUserAccount () {
	const data = {
		userName: faker.internet.userName(),
		password: faker.internet.password()
	};
	return data;
};

//tear down db
function tearDownDb () {
	console.warn('Deleting Test Database');
	return mongoose.connection.dropDatabase();
};

describe('Journal Back-end, login endpoint', function() {
	before(function () {
		return runServer(TEST_DATABASE_URL);
	});
	afterEach(function() {
		return tearDownDb();
	});
	after(function() {
		return closeServer();
	});
	//GET endpoint
	describe('GET Users Posts', function() {
		it('should return posts the user has made', function() {
			let newUser = generateUserAccount();
			let token;
			return chai.request(app).post('/register').send(newUser)
			.then(function(res) {
				token = res.body.token
			})
			let newPost = generatePostData();
			chai.request(app).post('/posts').set('Authorization', 'Bearer '+ token).send(newPost);
			return chai.request(app).get('/posts').set('Authorization', 'Bearer '+ token)
			.then(function (res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('id', 'date', 'content', 'userName');
				expect(res.body.id).to.not.be.null;
			})
		})
	});
	//POST endpoint
	describe('POST create a post', function() {
		it('should return a newly created post', function() {
			let newUser = generateUserAccount();
			let token;
			let newPost = generatePostData();
			return chai.request(app).post('/register').send(newUser)
			.then(function (res) {
				token = res.body.token
			})
			return chai.request(app).post('/posts').set('Authorization', 'Bearer '+ token).send(newPost)
			.then(function (res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('id', 'date', 'content', 'userName');
				expect(res.body.id).to.not.be.null;
				expect(res.body.date).to.not.be.null;
				expect(res.body.content).to.equal(newPost.content);
				expect(res.body.userName).to.equal(newUser.userName);
			})
		})
	});
	//PUT endpoint
	describe('PUT edit a post already made', function() {
		it('should return a editted post with correct values', function() {
			let newUser = generateUserAccount();
			let token;
			let newPost = generatePostData();
			return chai.request(app).post('/register').send(newUser)
			.then(function(res) {
				token = res.body.token
			})
			let postId;
			let edit = {content: 'Test'}
			return chai.request(app).post('/posts').set('Authorization', 'Bearer '+ token).send(newPost)
			//get id
			.then(function(res) {
				postId = res.body.id
			})
			return chai.request(app).put(`/posts/${postId}`).set('Authorization', 'Bearer '+ token).send(edit)
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res.body).to.have.keys('id', 'date', 'content', 'userName');
				expect(res.body.content).to.not.equal(newPost.content);
				expect(res.body.id).to.equal(postId);
				expect(res.body.userName).to.equal(newUser.userName)
			})
		})
	})
	//DELETE endpoint
	describe('DELETE delete a post', function() {
		it('Should remove a post', function() {
			let newUser = generateUserAccount();
			let token;
			let newPost = generatePostData();
			let postId;
			return chai.request(app).post('/register').send(newUser)
			.then(function(res) {
				token = res.body.token
			})
			return chai.request(app).post('/posts').set('Authorization', 'Bearer '+ token).send(newPost)
			.then(function(res) {
				postId = res.body.id
			})
			return chai.request(app).delete(`/posts/${postId}`).set('Authorization', 'Bearer '+ token)
			.then(function(res) {
				expect(res).to.have.status(204);
				expect(res.body.messege).to.equal('Success!');
				return Posts.findById(postId)
			})
			.then(function(_res) {
				expect(_res).to.be.null;
			})
		})
	})
})