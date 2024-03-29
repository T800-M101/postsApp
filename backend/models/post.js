const mongoose = require('mongoose');

// Squema is la like a class, just a blueprint
const postSchema = mongoose.Schema({
   title: { type: String, required: true },
   content: { type: String, required: true },
   imagePath: { type: String, required: true },
   creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


module.exports = mongoose.model( 'Post', postSchema );

