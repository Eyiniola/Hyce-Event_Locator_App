const request = require('supertest');
const app = require('../app');
const { Notification } = require('../models');

jest.mock('../models', () => ({
    Notification: {
        create: jest.fn(),
        findAll: jest.fn()
    }
}));

describe('Notification Tests', () => {
    it('should create a new notification', async () => {
        Notification.create.mockResolvedValue({
            id: 1, userId: 1, eventId: 2, message: 'Tech Meetup Soon!'
        });

        const res = await request(app).post('/notifications').send({
            userId: 1,
            eventId: 2,
            message: "Tech Meetup Soon!"
        });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Notification created');
    });

    it('should fetch user notifications', async () => {
        Notification.findAll.mockResolvedValue([
            { id: 1, userId: 1, message: 'Tech Meetup Soon!' },
            { id: 2, userId: 1, message: 'Startup Event Tomorrow' }
        ]);

        const res = await request(app).get('/notifications/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });
});

afterAll(async () => {
    const { sequelize } = require('../models'); // Import Sequelize instance
    await sequelize.close(); // Close DB connection
});
