// Location: pawfam-backend/models/DaycareCenter.js

const mongoose = require('mongoose');

const DaycareCenterSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    match: [/^\d{6}$/, 'ZIP Code must be exactly 6 digits']
  },
  phone: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Phone number must be 10 digits']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0
  },
  services: [{
    type: String,
    enum: ['Day Care', 'Overnight Stay', 'Grooming', 'Training', 'Vet Services', 'Pet Taxi']
  }],
  petTypes: [{
    type: String,
    enum: ['Dog', 'Cat', 'Bird', 'Other']
  }],
  facilities: [{
    type: String
  }],
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1000
  },
  operatingHours: {
    openTime: {
      type: String,
      required: true
    },
    closeTime: {
      type: String,
      required: true
    }
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
DaycareCenterSchema.index({ vendor: 1 });
DaycareCenterSchema.index({ city: 1, state: 1 });
DaycareCenterSchema.index({ isActive: 1 });

module.exports = mongoose.model('DaycareCenter', DaycareCenterSchema);