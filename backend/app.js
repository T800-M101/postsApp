const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');

const app = express();

mongoose.connect('AQUI TU MONGO CONNECTION STRING')
.then( () => {
    console.log('Connected to database!');
})
.catch( () => {
    console.error('Connection failed!');
});


// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use( (req, res, next) => {
   res.setHeader( "Access-Control-Allow-Origin", "*");
   res.setHeader( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.setHeader( "Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
   next(); 

});

app.use('/api/posts', postRoutes);

module.exports = app;