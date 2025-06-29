"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUnassignedMemberOnAProject = exports.getUserDetailsByUsername = exports.editUserDetails = exports.addNewUser = exports.getAllUsers = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Project_1 = __importDefault(require("../models/Project"));
// @route  GET api/user
// @desc   Get all user
// @access private
const getAllUsers = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseData = yield User_1.default.find().select('-_id -password -skills');
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllUsers = getAllUsers;
// @route  POST api/user
// @desc   Register new user
// @access Public
const addNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req); //Checking validation errors
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { name, email, username, password } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (user) {
            res.status(400).json({ 'error': 'User already exits' });
            return;
        }
        //checking is user with same username already exits(case insensitive).
        user = yield User_1.default.findOne({ username: { $regex: new RegExp(`^${username}$`), $options: 'i' } });
        if (user) {
            res.status(400).json({ 'error': 'Username already exits. Choose another one' });
            return;
        }
        const jwt_secret = process.env.JWTSECRET || '';
        if (!jwt_secret) {
            console.error('JWT secret is not defined in environment variables.');
            res.status(500).json({ 'error': 'Server Error' });
            return;
        }
        user = new User_1.default({
            name,
            username,
            email,
            password
        });
        const payload = {
            user: {
                id: user.id
            }
        };
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(password, salt);
        yield user.save();
        jsonwebtoken_1.default.sign(payload, jwt_secret, { expiresIn: 360000 }, (error, token) => {
            if (error)
                throw error;
            res.json({ token });
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Server Error');
    }
});
exports.addNewUser = addNewUser;
// @route  PUT api/user
// @desc   Edit user details
// @access Private
const editUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const errors = (0, express_validator_1.validationResult)(req); //Checking validation errors
    if (!errors.isEmpty()) {
        res.status(500).json({ 'error': 'Server Error ' });
        return;
    }
    let { fullName, username, email, role, newPassword, currentPassword, bio, skills, github, youtube, twitter, facebook, linkedIn, instagram, stackoverflow } = req.body.formState.inputs;
    // fullName = fullName.value
    // username = username.value
    // email = email.value
    // role = role.value
    // newPassword = newPassword.value
    // currentPassword = currentPassword.value
    // bio = bio.value
    // skills = skills.value
    // github = github.value
    // youtube = youtube.value
    // twitter = twitter.value
    // facebook = facebook.value
    // linkedIn = linkedIn.value
    // instagram = instagram.value
    // stackoverflow = stackoverflow.value
    const fullNameValue = fullName.value;
    const usernameValue = username.value;
    const emailValue = email.value;
    const roleValue = role.value;
    const newPasswordValue = newPassword.value;
    const currentPasswordValue = currentPassword.value;
    const bioValue = bio.value;
    let skillsValue = skills.value;
    const githubValue = github.value;
    const youtubeValue = youtube.value;
    const twitterValue = twitter.value;
    const facebookValue = facebook.value;
    const linkedInValue = linkedIn.value;
    const instagramValue = instagram.value;
    const stackoverflowValue = stackoverflow.value;
    // let updateObject = null;
    // if(skills.length > 0 && (typeof skills !== "object")) {
    //   skills = skills.split(',').map((skill: string) => skill.trim());
    // }
    if (typeof skillsValue === "string" && skillsValue.length > 0) {
        skillsValue = skillsValue.split(',').map((skill) => skill.trim());
    }
    try {
        let user = yield User_1.default.findOne({ _id: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id });
        if (!user) {
            res.status(500).json({ 'error': 'Server Error ' });
            return;
        } //user not found
        const isMatch = yield bcryptjs_1.default.compare(currentPasswordValue, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid Password' });
            return;
        } //password does not match
        const socialData = {
            github: githubValue,
            youtube: youtubeValue,
            twitter: twitterValue,
            facebook: facebookValue,
            linkedIn: linkedInValue,
            instagram: instagramValue,
            stackoverflow: stackoverflowValue
        };
        const updateObject = {
            name: fullNameValue,
            username: usernameValue,
            email: emailValue,
            role: roleValue,
            bio: bioValue,
            skills: skillsValue,
            social: socialData // Always use object structure
        };
        if (newPasswordValue && newPasswordValue.trim() !== '') {
            const salt = yield bcryptjs_1.default.genSalt(10);
            updateObject.password = yield bcryptjs_1.default.hash(newPasswordValue, salt);
        }
        // if(newPassword !== null) {
        //   const salt = await bcrypt.genSalt(10);
        //   newPassword = await bcrypt.hash(newPassword, salt);
        //   updateObject = {
        //     name: fullName,
        //     username: username,
        //     email: email,
        //     role: role,
        //     password: newPassword,
        //     bio,
        //     skills,
        //     social: [ github, youtube, twitter, facebook, linkedIn, instagram, stackoverflow ]
        //   }
        // } else {
        //   updateObject = {
        //     name: fullName,
        //     username: username,
        //     email: email,
        //     role: role,
        //     bio,
        //     skills,
        //     social: { github, youtube, twitter, facebook, linkedIn, instagram, stackoverflow }
        //   }
        // }
        const updatedUserDetails = yield User_1.default.findOneAndUpdate({ _id: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id }, updateObject, {
            new: true //to return the document after update was applied.
        });
        res.status(200).json(updatedUserDetails);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ 'error': 'Server Error ' });
    }
});
exports.editUserDetails = editUserDetails;
// @route  GET api/user/:username
// @desc   Get user by username
// @access private
const getUserDetailsByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseData = yield User_1.default.findOne({ username: req.params.username }).select('-_id -password');
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error(error);
    }
});
exports.getUserDetailsByUsername = getUserDetailsByUsername;
// @route  GET api/user/project/:projectId
// @desc   Get all unassigned member on this project
// @access Private
const getAllUnassignedMemberOnAProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allUser = yield User_1.default.find()
            .select('username -_id');
        const membersOfProject = yield Project_1.default.findOne({ _id: req.params.projectId })
            .select('members -_id')
            .populate('members.user', 'username -_id');
        if (!membersOfProject) {
            res.status(404).json({ "error": "Project not found" });
            return;
        }
        membersOfProject === null || membersOfProject === void 0 ? void 0 : membersOfProject.members.map(member => {
            allUser = allUser.filter(user => {
                // return user1.username !== user.user.username
                return user.username !== member.user.username;
            });
        });
        const nonMemberOfCurrentProject = allUser.map(user => {
            return user.username;
        });
        res.status(200).json(nonMemberOfCurrentProject);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ "error": "Server Error" });
    }
});
exports.getAllUnassignedMemberOnAProject = getAllUnassignedMemberOnAProject;
