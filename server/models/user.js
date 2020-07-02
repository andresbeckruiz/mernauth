const mongoose = require('mongoose');
const crpyto = require('crpyto');

//instantiate a new schema
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		max: 32

	},
	email: {
		type: String,
		trim: true,
		unique: true,
		lowercase: true,
		required: true,
	},
	hashed_password: {
		type: String,
		required: true,
	},
	//measures strength of password
	salt: String,
	role: {
		type: String,
		default: 'subscriber'
	}
	resetPasswordLink: {
		data: String,
		default: ''
	},
},{timestamps: true})

//virtual: takes password, hashes password, and saves password as hashed password
userSchema.virtual('password')
.set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashed_password = this.encryptPassword(password);
})
.get(function() {
	return this._password
})

//methods
userSchema.methods = {
	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	encryptPassword: function(password) {
		if (!password) return '';
		try {
			return crypto.createHmac('sha1', this.salt)
                   .update(password)
                   .digest('hex');
		}catch(err) {
			return '';
		}

	},

	makeSalt: function() {
		return Math.round(new Date().valueOf() * Math.random()) + ''
	}
}

module.exports = mongoose.model('User', userSchema);