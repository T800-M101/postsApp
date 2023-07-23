const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Squema is la like a class, just a blueprint
const userSchema = mongoose.Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true } 
});

userSchema.plugin(uniqueValidator);


module.exports = mongoose.model( 'User', userSchema );