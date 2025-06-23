import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../middleware/auth';
import { getAllUserData, authenticateOrLogin } from "../controllers/authControllers";

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

export default router;

