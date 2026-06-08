const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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

module.exports = mongoose.model('User', userSchema);