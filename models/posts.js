'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
//es6 Promise
mongoose.Promise = global.Promise;

const postSchema = mongoose.Schema({
	date: {type: String},
	title: {type: String, required: true},
	content: {type: String, required: true},
	userName: {type: String, required: true},
	windowColor: {type:String, required:true},
	fontColor: {type:String, required:true},
	postFont: {type:String, required:true}
});

postSchema.methods.serialize = function() {
	return {
		id: this.id,
		title: this.title,
		date: this.date,
		content: this.content,
		userName: this.userName,
		windowColor:this.windowColor,
		fontColor: this.fontColor,
		postFont: this.postFont
	};
};

const Posts = mongoose.model('Posts', postSchema);

module.exports = {Posts};