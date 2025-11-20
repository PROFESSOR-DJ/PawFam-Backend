const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Dog', 'Cat'],
        required: true
    },
    breed: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 30
    }
}, {
    timestamps: true
});

// Index for efficient querying by userId
PetSchema.index({ userId: 1 });

module.exports = mongoose.model('Pet', PetSchema);
