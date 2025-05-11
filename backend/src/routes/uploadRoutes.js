const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { uploadImage } = require("../controllers/uploadControllers");

// @route api/upload
router.route('/')
    // @desc  Upload an image, @access  Private
    .post(
        auth,
        uploadImage
    )

module.exports = router;
