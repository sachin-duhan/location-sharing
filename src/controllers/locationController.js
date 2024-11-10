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

module.exports = { updateLocation };
