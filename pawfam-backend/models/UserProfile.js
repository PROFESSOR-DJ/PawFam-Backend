const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{10}$/
    },
    residentialAddress: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
