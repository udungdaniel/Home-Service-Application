const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        availability: {
            type: Boolean,
            default: true
        },
        providerId: {
            type: String
        },
        rating: {
            type: Number,
            default: 0
        },
        imageUrl: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Service', serviceSchema);