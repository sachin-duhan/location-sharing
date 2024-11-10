const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('should return a JWT token on login', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      username: 'testuser'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return 401 for protected routes without token', async () => {
    const response = await request(app).post('/api/v1/orders').send({
      orderDetails: 'Test Order'
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Access denied');
  });
});
