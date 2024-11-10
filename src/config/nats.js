const { connect } = require('nats');

let nc;

// Check if we're in a test environment and optionally mock NATS
const connectNATS = async () => {
  if (process.env.NODE_ENV === 'test') {
    nc = {
      publish: jest.fn(() => Promise.resolve()),
    };
    console.log('Mock NATS connection created for testing');
  } else {
    nc = await connect({ servers: process.env.NATS_URL });
    console.log('Connected to NATS');
  }
};

const getNATSConnection = () => {
  if (!nc) throw new Error('NATS connection not initialized');
  return nc;
};

module.exports = { connectNATS, getNATSConnection };
