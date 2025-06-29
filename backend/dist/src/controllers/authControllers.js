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
exports.authenticateOrLogin = exports.getAllUserData = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// @route   GET api/auth
// @desc    Get user data expect password
// @access  Private
const getAllUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //as in authScreen.ts middleware req.user has the value of user id
        const user = yield User_1.default.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id).select('-password');
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ 'error': 'Server Error' });
    }
});
exports.getAllUserData = getAllUserData;
// @route  POST api/auth
// @desc   Authenticate / login user & get token
// @access Public
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req); //Checking for validation errors
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(422).json({ error: 'Invalid Credentials' });
            return;
        } //User not exits with given email
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(422).json({ error: 'Invalid Credentials' });
            return;
        }
        const Jwt_secret = process.env.JWTSECRET || '';
        if (!Jwt_secret) {
            console.error('❌ JWT_SECRET environment variable is not defined');
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jsonwebtoken_1.default.sign(payload, Jwt_secret, { expiresIn: 360000 }, (error, token) => {
            if (error)
                throw error;
            res.json({ token });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
exports.authenticateOrLogin = login;
