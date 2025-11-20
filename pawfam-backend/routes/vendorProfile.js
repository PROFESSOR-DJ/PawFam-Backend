const express = require('express');
const VendorProfile = require('../models/VendorProfile');
const auth = require('../middleware/auth');
const router = express.Router();

// Generate unique vendor ID
const generateVendorId = async () => {
    const count = await VendorProfile.countDocuments();
    const vendorId = `VEN${String(count + 1).padStart(6, '0')}`;
    return vendorId;
};

// Get vendor profile
router.get('/', auth, async (req, res) => {
    try {
        // Check if user is vendor
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied. Vendor role required.' });
        }

        const profile = await VendorProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.json({
                hasProfile: false,
                message: 'No vendor profile found'
            });
        }

        res.json({
            hasProfile: true,
            profile: {
                vendorId: profile.vendorId,
                userId: profile.userId,
                name: profile.name,
                gender: profile.gender,
                mobileNumber: profile.mobileNumber,
                communicationAddress: profile.communicationAddress,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            }
        });
    } catch (error) {
        console.error('Get vendor profile error:', error);
        res.status(500).json({ message: 'Server error fetching vendor profile' });
    }
});

// Create vendor profile
router.post('/', auth, async (req, res) => {
    try {
        // Check if user is vendor
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied. Vendor role required.' });
        }

        // Check if profile already exists
        const existingProfile = await VendorProfile.findOne({ userId: req.user._id });
        if (existingProfile) {
            return res.status(400).json({ message: 'Vendor profile already exists' });
        }

        const { name, gender, mobileNumber, communicationAddress } = req.body;

        // Validate required fields
        if (!name || !gender || !mobileNumber || !communicationAddress) {
            return res.status(400).json({
                message: 'Please provide all required fields: name, gender, mobileNumber, and communicationAddress'
            });
        }

        // Validate mobile number format
        if (!/^[0-9]{10}$/.test(mobileNumber)) {
            return res.status(400).json({
                message: 'Mobile number must be exactly 10 digits'
            });
        }

        // Validate gender
        if (!['Male', 'Female', 'Other'].includes(gender)) {
            return res.status(400).json({
                message: 'Gender must be Male, Female, or Other'
            });
        }

        // Generate unique vendor ID
        const vendorId = await generateVendorId();

        // Create new vendor profile
        const profile = new VendorProfile({
            userId: req.user._id,
            vendorId,
            name: name.trim(),
            gender,
            mobileNumber,
            communicationAddress: communicationAddress.trim()
        });

        await profile.save();

        res.status(201).json({
            message: 'Vendor profile created successfully',
            profile: {
                vendorId: profile.vendorId,
                userId: profile.userId,
                name: profile.name,
                gender: profile.gender,
                mobileNumber: profile.mobileNumber,
                communicationAddress: profile.communicationAddress,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            }
        });
    } catch (error) {
        console.error('Create vendor profile error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error: ' + error.message
            });
        }

        res.status(500).json({ message: 'Server error creating vendor profile' });
    }
});

// Update vendor profile
router.put('/', auth, async (req, res) => {
    try {
        // Check if user is vendor
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied. Vendor role required.' });
        }

        const { name, gender, mobileNumber, communicationAddress } = req.body;

        // Validate required fields
        if (!name || !gender || !mobileNumber || !communicationAddress) {
            return res.status(400).json({
                message: 'Please provide all required fields: name, gender, mobileNumber, and communicationAddress'
            });
        }

        // Validate mobile number format
        if (!/^[0-9]{10}$/.test(mobileNumber)) {
            return res.status(400).json({
                message: 'Mobile number must be exactly 10 digits'
            });
        }

        // Validate gender
        if (!['Male', 'Female', 'Other'].includes(gender)) {
            return res.status(400).json({
                message: 'Gender must be Male, Female, or Other'
            });
        }

        // Find and update profile
        const profile = await VendorProfile.findOneAndUpdate(
            { userId: req.user._id },
            {
                name: name.trim(),
                gender,
                mobileNumber,
                communicationAddress: communicationAddress.trim()
            },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        res.json({
            message: 'Vendor profile updated successfully',
            profile: {
                vendorId: profile.vendorId,
                userId: profile.userId,
                name: profile.name,
                gender: profile.gender,
                mobileNumber: profile.mobileNumber,
                communicationAddress: profile.communicationAddress,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt
            }
        });
    } catch (error) {
        console.error('Update vendor profile error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error: ' + error.message
            });
        }

        res.status(500).json({ message: 'Server error updating vendor profile' });
    }
});

// Delete vendor profile
router.delete('/', auth, async (req, res) => {
    try {
        // Check if user is vendor
        if (req.user.role !== 'vendor') {
            return res.status(403).json({ message: 'Access denied. Vendor role required.' });
        }

        const profile = await VendorProfile.findOneAndDelete({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }

        res.json({
            message: 'Vendor profile deleted successfully',
            deletedProfile: {
                vendorId: profile.vendorId,
                name: profile.name
            }
        });
    } catch (error) {
        console.error('Delete vendor profile error:', error);
        res.status(500).json({ message: 'Server error deleting vendor profile' });
    }
});

module.exports = router;
