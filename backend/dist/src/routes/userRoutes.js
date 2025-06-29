"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const userControllers_1 = require("../controllers/userControllers");
// @route api/user
router.route("/")
    // @desc  Get all user, @access private
    .get(auth_1.default, userControllers_1.getAllUsers)
    // @desc  Register new user, @access Public
    .post([
    (0, express_validator_1.check)('name', 'Name is required') //Checking is name field empty
        .not()
        .isEmpty(),
    (0, express_validator_1.check)('email', 'Enter a valid email') //Checking validity of given email
        .isEmail(),
    (0, express_validator_1.check)('username', 'Username is required')
        .not()
        .isEmpty(),
    (0, express_validator_1.check)('password', 'Enter a password of 6 or more character')
        .isLength({ min: 6 })
], userControllers_1.addNewUser)
    // @desc  Edit user user details,  @access Private
    .put(auth_1.default, [
    (0, express_validator_1.check)('formState.inputs.fullName.value', 'Name is required')
        .not()
        .isEmpty(),
    (0, express_validator_1.check)('formState.inputs.username.value', 'Username is required')
        .not()
        .isEmpty(),
    (0, express_validator_1.check)('formState.inputs.email.value', 'Enter a valid email')
        .isEmail(),
    (0, express_validator_1.check)('formState.inputs.role.value', 'Role is required')
        .not()
        .isEmpty(),
    (0, express_validator_1.check)('formState.inputs.currentPassword.value', 'Enter a password of 6 or more character')
        .isLength({ min: 6 })
], userControllers_1.editUserDetails);
// @route api/user/:username
router.route('/:username')
    // @desc   Get user by username, @access private
    .get(auth_1.default, userControllers_1.getUserDetailsByUsername);
// @route  api/user/project/:projectId
router.route('/project/:projectId')
    // @desc   Get all unassigned member on this project, @access Private
    .get(auth_1.default, userControllers_1.getAllUnassignedMemberOnAProject);
exports.default = router;
