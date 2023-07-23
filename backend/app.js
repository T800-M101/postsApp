
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/****** Importing Routes *****/
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

/****** Initialize express *****/
const app = express();

/****** Get connection to Mongo *****/
mongoose.connect('mongodb+srv://mrfraser:' + process.env.MONGO_ATLAS_PW +'@cluster0.l3fu03a.mongodb.net/node-angular')
.then( () => {
    console.log('Connected to database!');
    
})
.catch( () => {
    console.error('Connection failed!');
});


/***** Middleware *****/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

/***** Enable CORS *****/
app.use( (req, res, next) => {
   res.setHeader( "Access-Control-Allow-Origin", "*");
   res.setHeader( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   res.setHeader( "Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
   next(); 

});

/***** Call routes *****/
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;