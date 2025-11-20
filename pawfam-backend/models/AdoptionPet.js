// Location: pawfam-backend/models/AdoptionPet.js

const mongoose = require('mongoose');

const AdoptionPetSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  type: {
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  size: {
    type: String,
    required: true,
    enum: ['Small', 'Medium', 'Large']
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1000
  },
  temperament: [{
    type: String
  }],
  healthStatus: {
    vaccinated: {
      type: Boolean,
      default: false
    },
    neutered: {
      type: Boolean,
      default: false
    },
    healthConditions: {
      type: String,
      default: 'Healthy'
    }
  },
  shelter: {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Phone number must be 10 digits']
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    }
  },
  adoptionFee: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Available', 'Pending', 'Adopted'],
    default: 'Available'
  },
  specialNeeds: {
    type: String,
    default: 'None'
  },
  goodWith: {
    kids: {
      type: Boolean,
      default: true
    },
    dogs: {
      type: Boolean,
      default: true
    },
    cats: {
      type: Boolean,
      default: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
AdoptionPetSchema.index({ vendor: 1 });
AdoptionPetSchema.index({ type: 1, status: 1 });
AdoptionPetSchema.index({ isActive: 1 });

module.exports = mongoose.model('AdoptionPet', AdoptionPetSchema);