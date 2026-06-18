const { getAllServices, getServiceById } = require('../controllers/serviceController');
const Service = require('../models/Service');
const mongoose = require('mongoose');

describe('Service Controller - Unit Tests (GET Routes)', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.restoreAllMocks();
    });

    describe('getAllServices (GetAll Route)', () => {
        it('should return 200 and an array of all populated services on success', async () => {
            const mockServices = [
                {
                    _id: '60c72b2f9b1d8b2bad754aaa',
                    serviceName: 'Plumbing Repair',
                    price: 150,
                    providerId: { _id: '60c72b2f9b1d8b2bad754321', name: 'Steve Urkle' }

                }
            ];

            // Build mock chain for Service.find().populate().sort()
            const mockSort = jest.fn().mockResolvedValue(mockServices);
            const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
            jest.spyOn(Service, 'find').mockReturnValue({ populate: mockPopulate });

            await getAllServices(req, res);

            expect(Service.find).toHaveBeenCalledTimes(1);
            expect(mockPopulate).toHaveBeenCalledWith('providerId');
            expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockServices);
        });

        it('should return 500 if an database execution fails', async () => {
            const mockError = new Error('Database connection failed');

            const mockSort = jest.fn().mockRejectedValue(mockError);
            const mockPopulate = jest.fn().mockReturnValue({ sort: mockSort });
            jest.spyOn(Service, 'find').mockReturnValue({ populate: mockPopulate });

            await getAllServices(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Database connection failed'
            });
        });
    });

    describe('getServiceById (Get Route)', () => {
        it('should return 400 if the provided service ID is syntactically invalid', async () => {
            req.params.id = 'not-a-valid-object-id';

            await getServiceById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid service ID'
            });
        });
    
        it('should return 404 if the service does not exist in the database', async () => {
            const validMockId = new mongoose.Types.ObjectId().toString();
            req.params.id = validMockId;

            // Build mock chain for Service.findById().populate() returning null
            const mockPopulate = jest.fn().mockResolvedValue(null);
            jest.spyOn(Service, 'findById').mockReturnValue({ populate: mockPopulate });

            await getServiceById(req, res);

            expect(Service.findById).toHaveBeenCalledWith(validMockId);
            expect(mockPopulate).toHaveBeenCalledWith('providerId');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Service not found'
            });
        });
        
        it('should return 200 and the populated service object on success', async () => {
            const validMockId = new mongoose.Types.ObjectId().toString();
            req.params.id = validMockId;
            const mockService = {
                _id: validMockId,
                serviceName: 'Electrical Fix',
                price: 200,
                providerId: { _id: '60c72b2f9b1d8b2bad754321', name: 'Jane Smith' }
            };

            const mockPopulate = jest.fn().mockResolvedValue(mockService);
            jest.spyOn(Service, 'findById').mockReturnValue({ populate: mockPopulate });

            await getServiceById(req, res);

            expect(Service.findById).toHaveBeenCalledWith(validMockId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockService);
        });

        it('should return 500 an internal service query failure happens', async () => {
            const validMockId = new mongoose.Types.ObjectId().toString();
            req.params.id = validMockId;

            const mockPopulate = jest.fn().mockRejectedValue(new Error('Internal server error'));
            jest.spyOn(Service, 'findById').mockReturnValue({ populate: mockPopulate });

            await getServiceById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: ' Internal server error'
            });
        });
    });
});    
    
