const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Synchronous error
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT REJECTION🔥🔥🔥! SHUTTING DOWN...');
  process.exit(1); // Shutting down the app is mandatory. The app remains at unclean stage.
});
const app = require('./app');
const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASS);
const port = process.env.PORT || 5000;

mongoose.connect(DB).then(() => console.log('Database connected successfully!'));
const server = app.listen(port, () => console.log(`Server is up on port ${port}`));

// Asynchronous error
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION.🔥🔥🔥! SHUTTING DOWN...');
  server.close(() => {
    process.exit(1); // Crashing the app is optional
  });
});
