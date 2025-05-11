const { cloudinary } = require("../utils/cloudinary");
const User = require("../models/User");

// @route   POST api/upload
// @desc    Upload an image
// @access  Private
const uploadImage = async (req, res) => {
    try {
      const fileStr = req.body.data;
      //Uploading image
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });

      const user = await User.findById(req.user.id);
      //Deleting previous image
      if(user.profileImage.publicId) {
        await cloudinary.uploader.destroy( user.profileImage.publicId, function(error,result) {
          console.log(result, error)
        });
      }
      const updateObject = {
        profileImage: {
          imageUrl: uploadResponse.secure_url,
          publicId: uploadResponse.public_id
        }
      }
      await User.findOneAndUpdate( { _id: req.user.id }, updateObject, function(err, doc) {
        if (err) return res.status(500).json({ 'error': 'Server Error '});
      });

      res.status(200).json({
        imageUrl: uploadResponse.secure_url
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 'error': 'Server Error ' });
    }
}

module.exports = {
    uploadImage
}
