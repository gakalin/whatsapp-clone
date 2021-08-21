require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db/connection')();
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_URL, credentials: true }));
app.use(mongoSanitize());
app.use("/uploads", express.static("uploads"));

require('./routes')(app);
const server = app.listen(process.env.PORT, () => {
    console.log(`service started on port ${process.env.PORT}`);
})

const io = require('socket.io')(server);
const socket = require('./socket/socket')(io);
