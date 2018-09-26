'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
//es6 Promise
mongoose.Promise = global.Promise;

const postSchema = mongoose.Schema({
	date: {type: Number},
	content: {type: String, required: true},
	userName: {type: String, required: true}
});

postSchema.methods.serialize = function() {
	return {
		date: Date.now(),
		content: this.content,
		userName: this.userName
	};
};

const Posts = mongoose.model('Posts', postSchema);

module.exports = {Posts};