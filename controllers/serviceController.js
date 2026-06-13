
const mongoose = require('mongoose');

const Service = require('../models/Service');

const getAllServices = async (req, res) => {
    try {

        const services = await Service.find()
            .populate('providerId')
            .sort({ createdAt: -1 });

        res.status(200).json(services);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
  }
};

const getServiceById = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
        }

        const service = await Service.findById(req.params.id)
            .populate('providerId');

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json(service);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createService = async (req, res) => {
    try {

        const service = await Service.create({
            providerId: req.user._id,
            serviceName: req.body.serviceName,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price,
            availability: req.body.availability
        });

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: service
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateService = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
        }

        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Only the owner can update the service
        if (
            req.user &&
            service.providerId &&
            service.providerId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this service'
            });
        }

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('providerId');

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: updatedService
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteService = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid service ID'
            });
        }

        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Only the owner can delete the service
        if (
            req.user &&
            service.providerId &&
            service.providerId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this service'
            });
        }

        await Service.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};