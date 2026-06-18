process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');

const Booking = require('../models/Booking');

jest.mock('../models/Booking');

describe('Bookings API', () => {

    test('GET /api/bookings should return all bookings', async () => {

        Booking.find.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue([
                    {
                        _id: '1',
                        totalPrice: 100
                    }
                ])
            })
        });

        const res = await request(app)
            .get('/api/bookings');

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

});