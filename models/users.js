'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
//es6 Promise
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
	userName: {type: String, required: true},
	password: {type: String, required: true}
});

userSchema.methods.serialize = function() {
	return {
		userName: this.userName
	};
};

//validate password
userSchema.methods.validatePassword = function(password, hash) {
	return bcrypt.compareSync(password, hash);
};

//hash password
userSchema.methods.hashPass = function(password) {
	return bcrypt.hashSync(password, 10);
};

const Users = mongoose.model('Users', userSchema);

module.exports = {Users};