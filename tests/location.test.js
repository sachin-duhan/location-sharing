const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { connectNATS } = require('../src/config/nats');
const connectDB = require('../src/config/database');

describe('Location API', () => {
  let token;

  beforeAll(async () => {
    token = jwt.sign({ username: 'testuser' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await connectNATS(); // Initialize the (mocked) NATS connection for tests
    await connectDB();   // Connect to MongoDB for testing
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Ensure MongoDB connection closes after tests
  });

  it('should save location data with a valid token', async () => {
    const response = await request(app)
      .post('/api/v1/location')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: 'testuser',
        latitude: 37.7749,
        longitude: -122.4194,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Location updated and saved');
  });
});
