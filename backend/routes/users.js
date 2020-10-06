const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// @route  POST api/user
// @desc   Register new user
// @access Public
router.post(
    '/',
    [
        check('name', 'Name is required') //Checking is name field empty
            .not()
            .isEmpty(),
        check('email', 'Enter a valid email') //Checking validity of given email
            .isEmail(),
        check('username', 'Username is required')
            .not()
            .isEmpty(),
        check('password', 'Enter a password of 6 or more character')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req); //Checking validation errors
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const { name, email, username, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if(user) return res.status(400).json({ 'error' : 'User already exits' });
            user = await User.findOne({ username });
            if(user) return res.status(400).json({ 'error': 'Username already exits. Choose another one' });
            user = new User({
                name, username, email, password
            });
            const payload = {
                user: {
                    id: user.id
                }
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            jwt.sign(payload, process.env.JWTSCERET, { expiresIn: 360000 }, (error, token) => {
                    if(error) throw error;
                    res.json({ token });
                }
            )
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route  PUT api/user
// @desc   Edit user edit-project-details
// @access Private
router.put(
    '/',
    auth,
    [
        check('formState.inputs.fullName.value', 'Name is required')
            .not()
            .isEmpty(),
        check('formState.inputs.username.value', 'Username is required')
            .not()
            .isEmpty(),
        check('formState.inputs.email.value', 'Enter a valid email')
            .isEmail(),
        check('formState.inputs.role.value', 'Role is required')
            .not()
            .isEmpty(),
        check('formState.inputs.currentPassword.value', 'Enter a password of 6 or more character')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req); //Checking validation errors
        if(!errors.isEmpty()) return res.status(500).json({ 'error': 'Server Error1 '});

        let { fullName, username ,email, role, newPassword, currentPassword, bio, skills, github, youtube, twitter, facebook, linkedIn, instagram, stackoverflow } = req.body.formState.inputs;
        fullName = fullName.value, username = username.value, email = email.value, role = role.value, newPassword = newPassword.value,
        currentPassword = currentPassword.value, bio = bio.value, skills = skills.value, github = github.value, youtube = youtube.value,
        twitter = twitter.value, facebook = facebook.value, linkedIn = linkedIn.value, instagram = instagram.value, stackoverflow = stackoverflow.value;
        let updateObject = null;
        if(skills.length > 0 && (typeof skills !== "object")) {
            skills = skills.split(',').map(skill => skill.trim());
        }
        try {
            let user = await User.findOne({ _id: req.user.id });
            if(!user) return res.status(500).json({ 'error': 'Server Error2 '});
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(400).json({ error: 'Invalid Password' });
            if(newPassword !== null) {
                const salt = await bcrypt.genSalt(10);
                newPassword = await bcrypt.hash(newPassword, salt);
                updateObject = {
                    name: fullName,
                    username: username,
                    email: email,
                    role: role,
                    password: newPassword,
                    bio,
                    skills,
                    social: [ github, youtube, twitter, facebook, linkedIn, instagram, stackoverflow ]
                }
            } else {
                updateObject = {
                    name: fullName,
                    username: username,
                    email: email,
                    role: role,
                    bio,
                    skills,
                    social: { github, youtube, twitter, facebook, linkedIn, instagram, stackoverflow }
                }
            }
            await User.findOneAndUpdate( { _id: req.user.id }, updateObject, function(err, doc) {
                if (err) return res.status(500).json({ 'error': 'Server Error3 '});
                return res.status(200).json( doc )
            });

        } catch (e) {
            console.error(e.message);
            return res.status(500).json({ 'error': 'Server Error4 '});
        }
    }
);

// @route  GET api/user/project/:projectId
// @desc   Get all unassigned member on this project
// @access Private
router.get(
    '/project/:projectId',
    auth,
    async (req, res) => {
        try {
            let allUser = await User.find()
                .select('username -_id');
            const membersOfProject = await Project.findOne({ _id: req.params.projectId })
                .select('members -_id')
                .populate('members.user', 'username -_id');
            membersOfProject.members.map(user => {
                allUser = allUser.filter(user1 => {
                    return user1.username !== user.user.username
                })
            });
            const nonMemberOfCurrentProject = allUser.map(user => {
                return user.username;
            })
            return await res.status(200).json(nonMemberOfCurrentProject);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ "error": "Server Error" } );
        }
    }
)

// @route  GET api/user
// @desc   Get all user
// @access private
router.get(
    '/',
    auth,
    async (req, res) => {
        try{
            const responseData = await User.find().select('-_id -password -skills');
            return res.status(200).json(responseData);
        } catch (error) {
            console.error(error);
        }
    }
)

// @route  GET api/user/:username
// @desc   Get user by username
// @access private
router.get(
    '/:username',
    auth,
    async (req, res) => {
        try{
            const responseData = await User.findOne({ username: req.params.username }).select('-_id -password');
            return res.status(200).json(responseData);
        } catch (error) {
            console.error(error);
        }
    }
)

module.exports = router;
