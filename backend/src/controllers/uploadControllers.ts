import { cloudinary } from "../utils/cloudinary";
import {IExpressRequestWithUser} from "../types";
import User from "../models/User";
import {Response} from "express";

interface UploadImageRequest {
  data: string;
}

// @route   POST api/upload
// @desc    Upload an image
// @access  Private
const uploadImage = async (req: IExpressRequestWithUser & { body: UploadImageRequest }, res: Response) => {
    try {
      const fileStr = req.body.data;
      //Uploading image
      const uploadResponseFromCloudinary = await cloudinary.uploader.upload(fileStr, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });

      const user = await User.findById(req.user.id);
      if(!user) {
        console.error('User not found');
        res.status(404).json({ 'error': 'User not found' });
        return;
      }

      //Deleting previous image
      if(user.profileImage.publicId) {
        await cloudinary.uploader.destroy( user.profileImage.publicId, function(error,result) {
          console.log(result, error)
        });
      }
      const updateObject = {
        profileImage: {
          imageUrl: uploadResponseFromCloudinary.secure_url,
          publicId: uploadResponseFromCloudinary.public_id
        }
      }
      // await User.findOneAndUpdate( { _id: req.user.id }, updateObject, function(err, doc) {
      //   if (err) return res.status(500).json({ 'error': 'Server Error '});
      // });

      const updatedUser = await User.findOneAndUpdate(
          { _id: req.user.id },
          updateObject,
          { new: true } // This returns the updated document
      );

      if (!updatedUser) {
        res.status(500).json({ error: 'Failed to update user' });
        return;
      }

      res.status(200).json({
        imageUrl: uploadResponseFromCloudinary.secure_url
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ 'error': 'Server Error ' });
    }
}

export {
    uploadImage
}
