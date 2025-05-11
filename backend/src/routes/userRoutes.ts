import express from 'express';
const router = express.Router();
import { check } from 'express-validator';

import auth from '../middleware/auth';
import {
    getAllUsers, addNewUser, editUserDetails, getUserDetailsByUsername,
    getAllUnassignedMemberOnAProject
} from "../controllers/userControllers";


// @route api/user
router.route("/")
    // @desc  Get all user, @access private
    .get(
        auth,
        getAllUsers
    )
    // @desc  Register new user, @access Public
    .post(
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
        addNewUser
    )
    // @desc  Edit user user details,  @access Private
    .put(
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
        editUserDetails
    )

// @route api/user/:username
router.route('/:username')
    // @desc   Get user by username, @access private
    .get(
        auth,
        getUserDetailsByUsername
    )

// @route  api/user/project/:projectId
router.route('/project/:projectId')
    // @desc   Get all unassigned member on this project, @access Private
    .get(
        auth,
        getAllUnassignedMemberOnAProject
    )
export default router;
