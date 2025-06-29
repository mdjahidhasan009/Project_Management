"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const authControllers_1 = require("../controllers/authControllers");
// @route  api/auth
router.route("/")
    // @desc  Get user data expect password(already logged in), @access  Private
    .get(auth_1.default, authControllers_1.getAllUserData)
    // @desc login user & get token, @access Public
    .post([
    (0, express_validator_1.check)('email', 'Enter a valid email') //Checking is user given a valid email
        .isEmail(),
    (0, express_validator_1.check)('password', 'Password is required') //Checking password is not null
        .exists()
], authControllers_1.authenticateOrLogin);
exports.default = router;
