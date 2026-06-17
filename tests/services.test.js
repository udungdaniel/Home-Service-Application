process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');

const Service = require('../models/Service');

jest.mock('../models/Service');

describe('Services Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/services', () => {
        test('should return all services', async () => {
            const mockServices = [
                {
                    _id: '123',
                    serviceName: 'Plumbing',
                    category: 'Home Repair',
                    price: 100
                }
            ];

            Service.find.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(mockServices)
                })
            });

            const res = await request(app)
                .get('/api/services');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockServices);
        });
    });

    describe('GET /api/services/:id', () => {
        test('should return a single service', async () => {
            const mockService = {
                _id: '507f1f77bcf86cd799439011',
                serviceName: 'Electrical Repair',
                price: 150
            };

            Service.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockService)
            });

            const res = await request(app)
                .get('/api/services/507f1f77bcf86cd799439011');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual(mockService);
        });

        test('should return 400 for invalid id', async () => {
            const res = await request(app)
                .get('/api/services/invalid-id');

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid service ID');
        });
    });
});