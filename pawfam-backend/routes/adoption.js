const express = require('express');
const AdoptionApplication = require('../models/AdoptionApplication');
const auth = require('../middleware/auth');
const router = express.Router();

// Create adoption application
router.post('/applications', auth, async (req, res) => {
  try {
    const {
      pet,
      personalInfo,
      experience,
      visitSchedule,
      adoptionReason
    } = req.body;

    console.log('Request body:', req.body);

    // Validate required fields
    if (!pet || !personalInfo || !experience || !visitSchedule || !adoptionReason) {
      return res.status(400).json({
        message: 'Please provide all required fields (pet, personalInfo, experience, visitSchedule, adoptionReason)'
      });
    }

    // Validate pet object structure
    if (!pet.id || !pet.name || !pet.type || !pet.breed) {
      return res.status(400).json({
        message: 'Invalid pet information. Required: id, name, type, breed'
      });
    }

    // Validate personalInfo structure
    if (!personalInfo.fullName || !personalInfo.email || !personalInfo.phone || !personalInfo.address) {
      return res.status(400).json({
        message: 'Invalid personal information. Required: fullName, email, phone, address'
      });
    }

    // Validate visitSchedule structure
    if (!visitSchedule.date || !visitSchedule.time) {
      return res.status(400).json({
        message: 'Invalid visit schedule. Required: date, time'
      });
    }

    // Create new application with the structure matching frontend
    const application = new AdoptionApplication({
      user: req.user._id,
      pet: {
        id: pet.id,
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age || 'Unknown',
        shelter: pet.shelter || 'Unknown'
      },
      personalInfo: {
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        address: personalInfo.address
      },
      experience: {
        level: experience.level,
        details: experience.details || '',
        otherPets: experience.otherPets || 'no',
        otherPetsDetails: experience.otherPetsDetails || ''
      },
      visitSchedule: {
        date: new Date(visitSchedule.date),
        time: visitSchedule.time
      },
      adoptionReason
    });

    await application.save();

    console.log('Application created successfully:', application._id);

    res.status(201).json({
      message: 'Adoption application submitted successfully',
      application: {
        id: application._id,
        pet: application.pet,
        status: application.status,
        createdAt: application.createdAt
      }
    });
  } catch (error) {
    console.error('Application creation error:', error);
    res.status(500).json({ 
      message: 'Server error while creating application',
      error: error.message 
    });
  }
});

// Get all applications for logged-in user
router.get('/applications', auth, async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      applications,
      count: applications.length
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

// Get single application by ID
router.get('/applications/:id', auth, async (req, res) => {
  try {
    const application = await AdoptionApplication.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error while fetching application' });
  }
});

// UPDATE ADOPTION APPLICATION - NEW ENDPOINT
router.put('/applications/:id', auth, async (req, res) => {
  try {
    const {
      personalInfo,
      experience,
      visitSchedule,
      adoptionReason
    } = req.body;

    // Find application
    const application = await AdoptionApplication.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if application can be edited
    if (application.status === 'approved' || application.status === 'rejected') {
      return res.status(400).json({
        message: 'Cannot edit an application that has been approved or rejected'
      });
    }

    // Update personal info if provided
    if (personalInfo) {
      if (personalInfo.fullName) application.personalInfo.fullName = personalInfo.fullName;
      if (personalInfo.email) application.personalInfo.email = personalInfo.email;
      if (personalInfo.phone) application.personalInfo.phone = personalInfo.phone;
      if (personalInfo.address) application.personalInfo.address = personalInfo.address;
    }

    // Update experience if provided
    if (experience) {
      if (experience.level) application.experience.level = experience.level;
      if (experience.details !== undefined) application.experience.details = experience.details;
      if (experience.otherPets) application.experience.otherPets = experience.otherPets;
      if (experience.otherPetsDetails !== undefined) application.experience.otherPetsDetails = experience.otherPetsDetails;
    }

    // Update visit schedule if provided
    if (visitSchedule) {
      if (visitSchedule.date) application.visitSchedule.date = new Date(visitSchedule.date);
      if (visitSchedule.time) application.visitSchedule.time = visitSchedule.time;
    }

    // Update adoption reason if provided
    if (adoptionReason !== undefined) {
      application.adoptionReason = adoptionReason;
    }

    await application.save();

    res.json({
      message: 'Application updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      message: 'Server error updating application',
      error: error.message
    });
  }
});

// Update application status (admin only - you can add admin middleware later)
router.patch('/applications/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'under_review', 'approved', 'rejected', 'scheduled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await AdoptionApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      message: 'Application status updated',
      application
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
});

// REVOKE (CANCEL) APPLICATION - NEW ENDPOINT
router.patch('/applications/:id/revoke', auth, async (req, res) => {
  try {
    const application = await AdoptionApplication.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if application can be revoked
    if (application.status === 'approved' || application.status === 'rejected') {
      return res.status(400).json({
        message: 'Cannot revoke an application that has been approved or rejected'
      });
    }

    // Set status to rejected (cancelled)
    application.status = 'rejected';
    await application.save();

    res.json({
      message: 'Application revoked successfully',
      application
    });
  } catch (error) {
    console.error('Revoke application error:', error);
    res.status(500).json({
      message: 'Server error revoking application',
      error: error.message
    });
  }
});

// Delete application
router.delete('/applications/:id', auth, async (req, res) => {
  try {
    const application = await AdoptionApplication.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error while deleting application' });
  }
});

module.exports = router;