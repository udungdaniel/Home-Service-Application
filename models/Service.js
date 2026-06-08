const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
<<<<<<< HEAD
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
=======
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
>>>>>>> 75c6108a8af99525d49e4d7b64c889e21e33702f

module.exports = mongoose.model('Service', serviceSchema);