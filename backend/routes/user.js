const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const router = express.Router();



router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash 
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message:'user created!',
                result
            });
        })
        .catch(error => {
            res.status(500).json({
                message:'email must be unique.'
            });
        });
    });

});

router.post("/login", (req, res, next) => {

    User.findOne({ email: req.body.email })
        .then(response => {
            bcrypt.compare(req.body.password, response.password)
                .then(response => {
                    if (response) {
                        const token = jwt.sign(
                            { email: user.email, userId: user._id },
                            process.env.JWT_KEY,
                            { expiresIn: '1h' }
                        );
                        res.status(200).json({
                            token: token,
                            expiresIn: 3600,
                            userId: user._id
                        });
                    } else {
                        res.status(500).json({
                            message: 'Invalid authentication credentials!'
                        });
                    }
                });

        }).catch(error => {
            res.status(400).json({
                message: 'Invalid authentication credentials!'
            });
        });
});

   


    



module.exports = router;