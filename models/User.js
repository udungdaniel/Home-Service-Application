const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },

    githubId: {
        type: String,
        unique: true,
        sparse: true
    },

    role: {
        type: String,
        enum: ['customer', 'artisan', 'admin'],
        default: 'customer',
        required: true
    },

    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },

    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);