require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db/connection')();
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_URL, credentials: true }));
app.use(mongoSanitize());

require('./routes')(app);
app.listen(process.env.PORT, () => {
    console.log(`service started on port ${process.env.PORT}`);
})