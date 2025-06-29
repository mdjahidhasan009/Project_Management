"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = __importDefault(require("../middleware/auth"));
const uploadControllers_1 = require("../controllers/uploadControllers");
// @route api/upload
router.route('/')
    // @desc  Upload an image, @access  Private
    .post(auth_1.default, uploadControllers_1.uploadImage);
exports.default = router;
