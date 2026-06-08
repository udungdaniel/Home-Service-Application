const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
{
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Service provider is required']
    },

    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true
    },

    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },

    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },

    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },

    availability: {
        type: Boolean,
        default: true
    },

    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    imageUrl: {
        type: String,
        default: ''
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);