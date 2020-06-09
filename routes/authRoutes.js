const express = require('express');
const router = express.Router;
const { body } = require('express-validator/check')

const User = require('../models/user');
const authController = require('../controllers/authController');

//Sign Up Router with middleware validation using express-validator
router.post('/signup',[
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
            }
        });
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('username')
        .custom((value, { req }) => {
            return User.findOne({ username: value }).then(userDoc => {
                if (userDoc) {
                return Promise.reject('Username already exists!');
                }
            });
        })
        .trim()
        .isLength({ min: 5 }),
    ],
    //----Controller----
    authController.signUp);

//Sign In Router
router.post('/signin', authController.signIn);

module.exports = router;