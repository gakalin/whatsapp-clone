const express = require('express');
const userRouter = express.Router();
const userController = require("../../controllers/userController");

module.exports = (app) => {
    userRouter.post('/register', userController.register);
    app.use('/user', userRouter);
}