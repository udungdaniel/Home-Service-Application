process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');

const User = require('../models/User');

jest.mock('../models/User');

describe('Users API', () => {

    test('GET /api/users should return all users', async () => {

        User.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue([
                {
                    _id: '1',
                    name: 'Daniel',
                    email: 'daniel@test.com'
                }
            ])
        });

        const res = await request(app)
            .get('/api/users');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Daniel');
    });

    test('GET /api/users/:id should return one user', async () => {

        User.findById.mockResolvedValue({
            _id: '123456789012345678901234',
            name: 'Daniel',
            email: 'daniel@test.com'
        });

        const res = await request(app)
            .get('/api/users/123456789012345678901234');

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Daniel');
    });

});