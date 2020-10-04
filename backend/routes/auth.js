const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/auth
// @desc    Get user data expect password
// @access  Private
router.get('/', auth, async (req ,res) => {
    try {
        const user = await User.findById(req.user.id).select('-password') //as in auth.js middleware req.user has the value of user id
        await res.json(user);
    } catch(error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


// @route  POST api/auth
// @desc   Authenticate / login user & get token
// @access Public
router.post(
    '/',
    [
        check('email', 'Enter a valid email') //Checking is user given a valid email
            .isEmail(),
        check('password', 'Password is required') //Checking password is not null
            .exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);   //Checking for validation errors
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if(!user) return res.status(422).json({ error:  'Invalid Credentials' }); //User not exits with given email
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(422).json({ error: 'Invalid Credentials' });

            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(
                payload,
                process.env.JWTSCERET,
                { expiresIn: 360000 },
                (error, token) => {
                    if(error) throw error;
                    res.json({ token });
                }
            );
        } catch (error) {
            console.error(error)
            res.status(500).send('Server Error');
        }
    }
)

module.exports = router;
