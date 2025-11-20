const express = require('express');
const Pet = require('../models/Pet');
const auth = require('../middleware/auth');
const router = express.Router();

// Breed options
const BREEDS = {
    Dog: [
        'Labrador Retriever',
        'German Shepherd',
        'Golden Retriever',
        'Bulldog',
        'Beagle'
    ],
    Cat: [
        'Persian',
        'Maine Coon',
        'Siamese',
        'British Shorthair',
        'Bengal'
    ]
};

// Get breeds by category
router.get('/breeds/:category', (req, res) => {
    const { category } = req.params;

    if (!BREEDS[category]) {
        return res.status(400).json({
            message: 'Invalid category. Must be Dog or Cat'
        });
    }

    res.json({
        category,
        breeds: BREEDS[category]
    });
});

// Get all pets for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const pets = await Pet.find({ userId: req.user._id }).sort({ createdAt: -1 });

        res.json({
            pets: pets.map(pet => ({
                id: pet._id,
                userId: pet.userId,
                category: pet.category,
                breed: pet.breed,
                name: pet.name,
                age: pet.age,
                createdAt: pet.createdAt,
                updatedAt: pet.updatedAt
            })),
            count: pets.length
        });
    } catch (error) {
        console.error('Get pets error:', error);
        res.status(500).json({ message: 'Server error while fetching pets' });
    }
});

// Get single pet by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const pet = await Pet.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.json({
            pet: {
                id: pet._id,
                userId: pet.userId,
                category: pet.category,
                breed: pet.breed,
                name: pet.name,
                age: pet.age,
                createdAt: pet.createdAt,
                updatedAt: pet.updatedAt
            }
        });
    } catch (error) {
        console.error('Get pet error:', error);
        res.status(500).json({ message: 'Server error while fetching pet' });
    }
});

// Create new pet
router.post('/', auth, async (req, res) => {
    try {
        const { category, breed, name, age } = req.body;

        // Validate input
        if (!category || !breed || !name || age === undefined || age === null) {
            return res.status(400).json({
                message: 'Please provide all required fields: category, breed, name, and age'
            });
        }

        // Validate category
        if (!['Dog', 'Cat'].includes(category)) {
            return res.status(400).json({
                message: 'Category must be either Dog or Cat'
            });
        }

        // Validate breed for the selected category
        if (!BREEDS[category].includes(breed)) {
            return res.status(400).json({
                message: `Invalid breed for ${category}. Please select from the available options.`
            });
        }

        // Validate age
        const petAge = Number(age);
        if (isNaN(petAge) || petAge < 0 || petAge > 30) {
            return res.status(400).json({
                message: 'Age must be a number between 0 and 30'
            });
        }

        // Validate name
        if (name.trim().length < 2 || name.trim().length > 50) {
            return res.status(400).json({
                message: 'Pet name must be between 2 and 50 characters'
            });
        }

        // Create new pet
        const pet = new Pet({
            userId: req.user._id,
            category,
            breed,
            name: name.trim(),
            age: petAge
        });

        await pet.save();

        res.status(201).json({
            message: 'Pet added successfully',
            pet: {
                id: pet._id,
                userId: pet.userId,
                category: pet.category,
                breed: pet.breed,
                name: pet.name,
                age: pet.age,
                createdAt: pet.createdAt,
                updatedAt: pet.updatedAt
            }
        });
    } catch (error) {
        console.error('Create pet error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error: ' + error.message
            });
        }

        res.status(500).json({ message: 'Server error while creating pet' });
    }
});

// Update pet
router.put('/:id', auth, async (req, res) => {
    try {
        const { category, breed, name, age } = req.body;

        // Validate input
        if (!category || !breed || !name || age === undefined || age === null) {
            return res.status(400).json({
                message: 'Please provide all required fields: category, breed, name, and age'
            });
        }

        // Validate category
        if (!['Dog', 'Cat'].includes(category)) {
            return res.status(400).json({
                message: 'Category must be either Dog or Cat'
            });
        }

        // Validate breed for the selected category
        if (!BREEDS[category].includes(breed)) {
            return res.status(400).json({
                message: `Invalid breed for ${category}. Please select from the available options.`
            });
        }

        // Validate age
        const petAge = Number(age);
        if (isNaN(petAge) || petAge < 0 || petAge > 30) {
            return res.status(400).json({
                message: 'Age must be a number between 0 and 30'
            });
        }

        // Validate name
        if (name.trim().length < 2 || name.trim().length > 50) {
            return res.status(400).json({
                message: 'Pet name must be between 2 and 50 characters'
            });
        }

        // Find and update pet (only if it belongs to the user)
        const pet = await Pet.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            {
                category,
                breed,
                name: name.trim(),
                age: petAge
            },
            { new: true, runValidators: true }
        );

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.json({
            message: 'Pet updated successfully',
            pet: {
                id: pet._id,
                userId: pet.userId,
                category: pet.category,
                breed: pet.breed,
                name: pet.name,
                age: pet.age,
                createdAt: pet.createdAt,
                updatedAt: pet.updatedAt
            }
        });
    } catch (error) {
        console.error('Update pet error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error: ' + error.message
            });
        }

        res.status(500).json({ message: 'Server error while updating pet' });
    }
});

// Delete pet
router.delete('/:id', auth, async (req, res) => {
    try {
        const pet = await Pet.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.json({
            message: 'Pet deleted successfully',
            deletedPet: {
                id: pet._id,
                name: pet.name
            }
        });
    } catch (error) {
        console.error('Delete pet error:', error);
        res.status(500).json({ message: 'Server error while deleting pet' });
    }
});

module.exports = router;
