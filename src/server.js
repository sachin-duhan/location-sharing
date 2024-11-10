require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { connectNATS } = require('./config/nats');

const port = process.env.PORT || 3000;

(async () => {
  await connectDB();
  await connectNATS();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
