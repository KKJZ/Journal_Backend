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
		password: faker.internet.passwor()
	};
	return data;
};

describe('Journal Back-end, login endpoint', )