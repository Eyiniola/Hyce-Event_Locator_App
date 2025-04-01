const request = require('supertest');
const app = require('../app');
const { User, Event } = require('../models');

jest.mock('../models', () => ({
    User: {
        findByPk: jest.fn(),
    },
    Event: {
        findByPk: jest.fn(),
    }
}));

describe('Favorite Events', () => {
    it('should add an event to favorites', async () => {
        const mockUser = { id: 1, addFavorites: jest.fn() };
        const mockEvent = { id: 2 };

        User.findByPk.mockResolvedValue(mockUser);
        Event.findByPk.mockResolvedValue(mockEvent);

        const res = await request(app).post('/api/users/1/favorites/2');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Event added to favorites');
        expect(mockUser.addFavorites).toHaveBeenCalledWith(mockEvent);
    });

    it('should return 404 if user or event is not found', async () => {
        User.findByPk.mockResolvedValue(null);
        Event.findByPk.mockResolvedValue(null);

        const res = await request(app).post('/users/1/favorites/2');
        expect(res.status).toBe(404);
    });
});

afterAll(async () => {
    const { sequelize } = require('../models'); // Import Sequelize instance
    await sequelize.close(); // Close DB connection
});
