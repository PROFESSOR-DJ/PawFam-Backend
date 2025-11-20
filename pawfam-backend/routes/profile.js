const express = require('express');
const UserProfile = require('../models/UserProfile');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({
                message: 'Profile not found',
                hasProfile: false
            });
        }

        res.json({
            profile: {
                id: profile._id,
                userId: profile.userId,
                name: profile.name,
                gender: profile.gender,
                mobileNumber: profile.mobileNumber,
                residentialAddress: profile.residentialAddress
            },
            hasProfile: true
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
});

// Create user profile
router.post('/', auth, async (req, res) => {
    try {
        const { name, gender, mobileNumber, residentialAddress } = req.body;

        // Validate input
        if (!name || !gender || !mobileNumber || !residentialAddress) {
            return res.status(400).json({
                message: 'Please provide all required fields: name, gender, mobile number, and residential address'
            });
        }

        // Check if profile already exists
        const existingProfile = await UserProfile.findOne({ userId: req.user._id });
        if (existingProfile) {
            return res.status(400).json({
                message: 'Profile already exists. Use update endpoint instead.'
            });
        }

        // Validate mobile number format (10 digits)
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

        // Create new profile
        const profile = new UserProfile({
            userId: req.user._id,
            name,
            gender,
            mobileNumber,
            residentialAddress
        });

        await profile.save();

        res.status(201).json({
            message: 'Profile created successfully',
            profile: {
                id: profile._id,
                userId: profile.userId,
                name: profile.name,
                gender: profile.gender,
                mobileNumber: profile.mobileNumber,
                residentialAddress: profile.residentialAddress
            }
        });
    } catch (error) {
        console.error('Create profile error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error: ' + error.message
            });
        }

        res.status(500).json({ message: 'Server error while creating profile' });
    }
});

// Update user profile
router.put('/', auth, async (req, res) => {
    try {
        const { name, gender, mobileNumber, residentialAddress } = req.body;

        // Validate input
        if (!name || !gender || !mobileNumber || !residentialAddress) {
            return res.status(400).json({
                message: 'Please provide all required fields: name, gender, mobile number, and residential address'
            });
        }

        // Validate mobile number format (10 digits)
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
        const profile = await UserProfile.findOneAndUpdate(
            { userId: req.user._id },
            {
                name,
                gender,
                mobileNumber,
                residentialAddress
            },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            profile: {
                id: profile._id,
                userId: profile.userId,
                name: profile.name,
                gender: profile.gender,
                mobileNumber: profile.mobileNumber,
                residentialAddress: profile.residentialAddress
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error: ' + error.message
            });
        }

        res.status(500).json({ message: 'Server error while updating profile' });
    }
});

// Delete user profile
router.delete('/', auth, async (req, res) => {
    try {
        const profile = await UserProfile.findOneAndDelete({ userId: req.user._id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json({
            message: 'Profile deleted successfully'
        });
    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({ message: 'Server error while deleting profile' });
    }
});

module.exports = router;
