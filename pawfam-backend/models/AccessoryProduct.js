// Location: pawfam-backend/models/AccessoryProduct.js

const mongoose = require('mongoose');

const AccessoryProductSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Toys', 'Grooming', 'Accessories', 'Healthcare', 'Bedding', 'Clothing']
  },
  petType: {
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'All Pets']
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  specifications: [{
    key: String,
    value: String
  }],
  images: [{
    type: String
  }],
  weight: {
    type: String
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  },
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
  tags: [{
    type: String
  }],
  shippingInfo: {
    freeShipping: {
      type: Boolean,
      default: false
    },
    deliveryTime: {
      type: String,
      default: '3-5 business days'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
AccessoryProductSchema.index({ vendor: 1 });
AccessoryProductSchema.index({ category: 1, petType: 1 });
AccessoryProductSchema.index({ isActive: 1 });

module.exports = mongoose.model('AccessoryProduct', AccessoryProductSchema);