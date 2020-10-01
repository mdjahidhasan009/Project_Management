const express = require('express');
const router = express.Router();

const User = require('../models/User');

const auth = require('../middleware/auth');
const { cloudinary } = require('../utils/cloudinary');

// @route   POST api/upload
// @desc    Upload an image
// @access  Private
router.post(
    '/',
    auth,
    async (req, res) => {
        try {
            // console.log('in /api/upload api');
            const fileStr = req.body.data;
            let removeResponse = null;
            // console.log(fileStr);
            const uploadResponse = await cloudinary.uploader.upload(fileStr, {
                upload_preset: 'project-tracker-385305',
            });
            // console.log(uploadResponse);
            // console.log(req.user.id);

            const user = await User.findById(req.user.id);
            if(user.profileImage.publicId) {
                removeResponse = await cloudinary.uploader.destroy( user.profileImage.publicId, function(error,result) {
                    console.log(result, error)
                });
            }
            // console.log(removeResponse);

            const updateObject = {
                profileImage: {
                    imageUrl: uploadResponse.secure_url,
                    publicId: uploadResponse.public_id
                }
            }
            await User.findOneAndUpdate( { _id: req.user.id }, updateObject, function(err, doc) {
                if (err) return res.status(500).json({ 'error': 'Server Error3 '});
                // console.log(doc);
                // return res.status(200).json( doc )
            });

            res.status(200).json({
                imageUrl: uploadResponse.secure_url
            });
            // res.json({ msg: 'yaya' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ err: 'Something went wrong' });
        }
    }
)

// @route   DELETE api/upload
// @desc    Upload an image
// @access  Private
router.delete(
    '/',
    // auth,
    async (req, res) => {
        try {
            // console.log('in /api/upload api delete');
            // const fileStr = req.body.data;
            // console.log(fileStr);
            // console.log(cloudinary);
            const uploadResponse = await cloudinary.uploader.destroy('vsqz5wgx5b6zfzzsizpa', function(error,result) {
                console.log(result, error)
            });
            // const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            //     upload_preset: 'project-tracker-385305',
            // });
            // console.log(uploadResponse);
            res.json({ msg: 'yaya' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ err: 'Something went wrong' });
        }
    }
)

module.exports = router;
