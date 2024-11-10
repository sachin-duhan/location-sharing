const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const { connectNATS } = require('../src/config/nats');

describe('Order API', () => {
  let token;

  beforeAll(async () => {
    token = jwt.sign({ username: 'testuser' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await connectNATS();
  });

  it('should allow sending an order with a valid token', async () => {
    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderDetails: 'Test Order' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Order sent');
  });
});
