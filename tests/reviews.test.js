process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');

const Review = require('../models/Review');

jest.mock('../models/Review');

describe('Reviews Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/reviews', () => {
        test('should return all reviews', async () => {
            const mockReviews = [
                {
                    _id: '123',
                    rating: 5,
                    comment: 'Excellent service!'
                }
            ];

            Review.find.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockReviews)
                })
            });

            const res = await request(app)
                .get('/api/reviews');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockReviews);
        });
    });

    describe('GET /api/reviews/:id', () => {
        test('should return a single review', async () => {
            const mockReview = {
                _id: '507f1f77bcf86cd799439011',
                rating: 4,
                comment: 'Very good service'
            };

            Review.findById.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockReview)
                })
            });

            const res = await request(app)
                .get('/api/reviews/507f1f77bcf86cd799439011');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockReview);
        });

        test('should return 400 for invalid id', async () => {
            const res = await request(app)
                .get('/api/reviews/invalid-id');

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid review ID');
        });
    });
});