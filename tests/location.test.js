const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { connectNATS } = require('../src/config/nats');
const connectDB = require('../src/config/database');
const Location = require('../src/models/Location');

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

  it('should return locations for a list of valid userIds', async () => {
    await Location.create({ userId: 'user1', latitude: 40.7128, longitude: -74.0060 });
    await Location.create({ userId: 'user2', latitude: 34.0522, longitude: -118.2437 });
    await Location.create({ userId: 'user3', latitude: 51.5074, longitude: -0.1278 });

    const response = await request(app)
      .post('/api/v1/location/getLocations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userIds: ['user1', 'user2', 'user3'],
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.locations).toHaveLength(3);
    response.body.locations.forEach((locationData) => {
      expect(locationData).toHaveProperty('userId');
      expect(locationData).toHaveProperty('location');
      expect(locationData.location).toHaveProperty('latitude');
      expect(locationData.location).toHaveProperty('longitude');
    });
  });

  it('should return 401 if token is missing', async () => {
    const response = await request(app)
      .post('/api/v1/location/getLocations')
      .send({
        userIds: ['user1', 'user2'],
      });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Access denied');
  });

  it('should return 400 if userIds array is empty', async () => {
    const response = await request(app)
      .post('/api/v1/location/getLocations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userIds: [],
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('userIds array cannot be empty');
  });

  it('should handle non-existent userIds gracefully', async () => {
    const response = await request(app)
      .post('/api/v1/location/getLocations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userIds: ['nonexistentUser1', 'nonexistentUser2'],
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.locations).toHaveLength(2);
    response.body.locations.forEach((locationData) => {
      expect(locationData.error).toBe('Location not found');
    });
  });

  it('should return 400 if userIds is not an array', async () => {
    const response = await request(app)
      .post('/api/v1/location/getLocations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userIds: 'notAnArray',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('userIds should be an array');
  });
});
