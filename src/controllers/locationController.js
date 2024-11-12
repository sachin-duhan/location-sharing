const { getNATSConnection } = require('../config/nats');
const Location = require('../models/Location');

const updateLocation = async (req, res) => {
  const nc = getNATSConnection();
  const { userId, latitude, longitude } = req.body;

  await nc.publish('location-updates', JSON.stringify({ userId, latitude, longitude }));
  const location = new Location({ userId, latitude, longitude });
  await location.save();

  res.status(200).json({ message: 'Location updated and saved' });
};

const getLocations = async (req, res) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds)) {
    return res.status(400).json({ error: 'userIds should be an array' });
  }

  if (userIds.length === 0) {
    return res.status(400).json({ error: 'userIds array cannot be empty' });
  }

  try {
    const locations = await Promise.all(
      userIds.map(async (userId) => {
        const location = await Location.findOne({ userId }).sort({ timestamp: -1 });
        return location
          ? { userId, location }
          : { userId, error: 'Location not found' };
      })
    );

    res.status(200).json({ locations });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { updateLocation, getLocations };
