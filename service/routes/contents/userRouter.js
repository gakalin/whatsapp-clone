const express = require('express');
const userRouter = express.Router();
const userController = require("../../controllers/userController");

module.exports = (app) => {
    userRouter.post('/register', userController.register);
    userRouter.post('/login', userController.login);
    userRouter.get('/auth', userController.auth);
    userRouter.post('/googleAuth', userController.googleAuth);
    userRouter.post('/discordAuth', userController.discordAuth);
    app.use('/user', userRouter);
}