const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    role: {
        type: String,
        require: true
    },
    bio: {
        type: String,
        require: true
    },
    skills: {
        type: [String],
        required: true
    },
    profileImage: {
        imageUrl: {
            type: String,
            require: true
        },
        publicId: {
            type: String,
            require: true
        }
    },
    social: {
        github: {
            type: String
        },
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedIn: {
            type: String
        },
        instagram: {
            type: String
        },
        stackoverflow: {
            type: String
        }
    },
    password: {
        type: String,
        require: true
    }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
