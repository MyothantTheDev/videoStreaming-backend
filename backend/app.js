const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

//middleware
const errorMiddleware = require('./middleware/error');


app.use(express.json());

// user cookie parser
app.use(cookieParser());

// Import all routes
const students = require('./routes/studentRoute');
const batch = require('./routes/batchRoute');
const auth = require('./routes/authRoute');
const video = require('./routes/videoRoute');
const job = require('./routes/jobRoute');

app.use('/api/v1', students);
app.use('/api/v1', batch);
app.use('/api/v1', auth);
app.use('/api/v1', video);
app.use('/api/v1', job);

//Middle to handle errors
app.use(errorMiddleware);

module.exports = app;