const express = require('express');
const router = express.Router();

const User = require('../models/User');

const auth = require('../middleware/auth');
const { cloudinary } = require('../utils/cloudinary');
const { uploadImage } = require("../controllers/uploadControllers");

// @route api/upload
router.route('/')
    // @desc    Upload an image, @access  Private
    .post(
        auth,
        uploadImage
    )

module.exports = router;
