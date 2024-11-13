require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const { connect, StringCodec, AckPolicy, consumerOpts } = require('nats');
const Location = require('./models/Location');

// Configuration from environment variables
const config = {
  port: process.env.PORT || 3000,
  dbURI: process.env.MONGO_URI,
  natsURL: process.env.NATS_URL,
  streamName: process.env.NATS_STREAM_NAME || 'location_updates',
  subject: process.env.NATS_SUBJECT || 'location.updates',
  retryCount: parseInt(process.env.NATS_RETRY_COUNT, 10) || 5,
  retryDelay: parseInt(process.env.NATS_RETRY_DELAY, 10) || 2000,
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Retry connection to NATS
const connectWithRetry = async (retries = config.retryCount, delay = config.retryDelay) => {
  while (retries > 0) {
    try {
      const nc = await connect({ servers: config.natsURL });
      console.log('Connected to NATS');
      return nc;
    } catch (error) {
      console.error(`Failed to connect to NATS: ${error.message}. Retrying...`);
      retries--;
      if (retries === 0) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Process and save location data to MongoDB
const processLocationMessage = async (msg, sc) => {
  const locationData = JSON.parse(sc.decode(msg.data));
  const { userId, latitude, longitude, timestamp } = locationData;

  const location = new Location({ userId, latitude, longitude, timestamp });
  await location.save();
  console.log(`Location saved for user: ${userId} - {lat: ${latitude}, long: ${longitude}}`);
};

// Main application setup
(async () => {
  await connectDB(); // Connect to MongoDB
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });

  const nc = await connectWithRetry(); // Connect to NATS with retry
  const js = nc.jetstream();
  const sc = StringCodec();

  // Get the JetStreamManager to manage streams
  const jsm = await nc.jetstreamManager();

  // Check if the stream exists, create it if it doesn't
  try {
    await jsm.streams.info(config.streamName);
    console.log(`Stream "${config.streamName}" already exists.`);
  } catch (err) {
    console.error(`Stream "${config.streamName}" does not exist. Creating stream...`);
    try {
      await jsm.streams.add({
        name: config.streamName,
        subjects: [config.subject],
        retention: 'limits', // Optional: set retention policy
        max_consumers: -1,   // Optional: unlimited consumers
        max_msgs: -1,        // Optional: unlimited messages
        max_bytes: -1,       // Optional: unlimited size
        max_age: 0,          // Optional: messages never expire
        storage: 'file',     // Optional: storage type ('file' or 'memory')
      });
      console.log(`Stream "${config.streamName}" created.`);
    } catch (streamCreationError) {
      console.error('Error creating stream:', streamCreationError);
      process.exit(1); // Exit if unable to create the stream
    }
  }

  // Subscribe to the subject with a durable consumer using consumerOpts
  const opts = consumerOpts();
  opts.durable('location-consumer');
  opts.manualAck();
  opts.ackExplicit();
  opts.deliverTo('location-updates-deliver'); // Unique subject for delivery

  const sub = await js.subscribe(config.subject, opts);

  console.log('Listening for location updates...');

  // Process each incoming message
  for await (const msg of sub) {
    try {
      await processLocationMessage(msg, sc);
      msg.ack(); // Acknowledge the message to prevent redelivery
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
})();
