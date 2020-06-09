const { validationResult } = require('express-validator/check'); //Use this method with req param to recieve the result of the validation done in auth route
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const service = require('../service/token');

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty){ //If the validation result returns empty arr, it means there are no errors in validation
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        //role: req.body.role,
    })

};

exports.signIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
        .then( user => {
            if(err) res.status(500).send({message: err})
            if(!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isCorrectPassword => {
            if (!isCorrectPassword) {
                const error = new Error('Password is incorrect.');
                error.statusCode = 401;
                throw error;
            }
            // user is found, and password matches, so we return a new jwt
            let token = service.createToken(loadedUser)
            res.status(200).json({ token: token }); // you can also send the userId here ( userId: loadedUser._id.toString() )
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


