const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(routes);

require('dotenv').config() ;

mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

module.exports = app;

