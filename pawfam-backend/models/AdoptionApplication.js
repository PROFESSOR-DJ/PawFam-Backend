const mongoose = require('mongoose');

const adoptionApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Store complete pet information as an embedded object
  pet: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: String, required: true },
    shelter: { type: String, required: true }
  },
  // Personal information object (matches frontend structure)
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  // Experience information
  experience: {
    level: { type: String, required: true },
    details: { type: String },
    otherPets: { type: String },
    otherPetsDetails: { type: String }
  },
  // Visit schedule
  visitSchedule: {
    date: { type: Date, required: true },
    time: { type: String, required: true }
  },
  // Adoption reason
  adoptionReason: {
    type: String,
    required: true
  },
  // Application status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'scheduled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdoptionApplication', adoptionApplicationSchema);