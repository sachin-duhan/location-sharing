const { getNATSConnection } = require('../config/nats');

const sendOrder = async (req, res) => {
  const nc = getNATSConnection();
  const orderData = req.body;

  await nc.publish('orders', JSON.stringify(orderData));
  res.status(200).json({ message: 'Order sent' });
};

module.exports = { sendOrder };
