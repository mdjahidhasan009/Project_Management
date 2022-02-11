const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const User = require('../models/User');
const { getAllUserData, authenticateOrLogin} = require("../controllers/authControllers");

// @route  api/auth
router.route("/")
    // @desc  Get user data expect password(already logged in), @access  Private
    .get(
        auth,
        getAllUserData
    )
    // @desc login user & get token, @access Public
    .post(
        [
            check('email', 'Enter a valid email') //Checking is user given a valid email
                .isEmail(),
            check('password', 'Password is required') //Checking password is not null
                .exists()
        ],
        authenticateOrLogin
    )

module.exports = router;
