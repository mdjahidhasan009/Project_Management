"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_1 = require("../utils/cloudinary");
const User_1 = __importDefault(require("../models/User"));
// @route   POST api/upload
// @desc    Upload an image
// @access  Private
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const fileStr = req.body.data;
        //Uploading image
        const uploadResponseFromCloudinary = yield cloudinary_1.cloudinary.uploader.upload(fileStr, {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        });
        const user = yield User_1.default.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            console.error('User not found');
            res.status(404).json({ 'error': 'User not found' });
            return;
        }
        //Deleting previous image
        if (user.profileImage.publicId) {
            yield cloudinary_1.cloudinary.uploader.destroy(user.profileImage.publicId, function (error, result) {
                console.log(result, error);
            });
        }
        const updateObject = {
            profileImage: {
                imageUrl: uploadResponseFromCloudinary.secure_url,
                publicId: uploadResponseFromCloudinary.public_id
            }
        };
        // await User.findOneAndUpdate( { _id: req.user.id }, updateObject, function(err, doc) {
        //   if (err) return res.status(500).json({ 'error': 'Server Error '});
        // });
        const updatedUser = yield User_1.default.findOneAndUpdate({ _id: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id }, updateObject, { new: true } // This returns the updated document
        );
        if (!updatedUser) {
            res.status(500).json({ error: 'Failed to update user' });
            return;
        }
        res.status(200).json({
            imageUrl: uploadResponseFromCloudinary.secure_url
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ 'error': 'Server Error ' });
    }
});
exports.uploadImage = uploadImage;
