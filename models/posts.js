'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
//es6 Promise
mongoose.Promise = global.Promise;

const postSchema = mongoose.Schema({
	date: {type: String},
	content: {type: String, required: true},
	userName: {type: String, required: true}
});

//need to ask ken about a time virtual

postSchema.methods.serialize = function() {
	return {
		id: this.id,
		date: this.date,
		content: this.content,
		userName: this.userName
	};
};

const Posts = mongoose.model('Posts', postSchema);

module.exports = {Posts};