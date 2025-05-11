import express from 'express';
const router = express.Router();

import auth from '../middleware/auth';
import { uploadImage } from "../controllers/uploadControllers";

// @route api/upload
router.route('/')
    // @desc  Upload an image, @access  Private
    .post(
        auth,
        uploadImage
    )

export default router;
