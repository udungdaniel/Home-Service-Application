const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
<<<<<<< HEAD
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
=======
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        githubId: {
            type: String
        },
        role: {
            type: String,
            default: 'customer'
        },
        phone: {
            type: String
        },
        address: {
            type: String
        }
    },
    {
        timestamps: true
    }
);
>>>>>>> 75c6108a8af99525d49e4d7b64c889e21e33702f

module.exports = mongoose.model('User', userSchema);