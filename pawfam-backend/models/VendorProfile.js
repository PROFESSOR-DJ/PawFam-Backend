const mongoose = require('mongoose');

const VendorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    vendorId: {
        type: String,
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
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    mobileNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    communicationAddress: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Index for faster queries
VendorProfileSchema.index({ userId: 1 });
VendorProfileSchema.index({ vendorId: 1 });

module.exports = mongoose.model('VendorProfile', VendorProfileSchema);
