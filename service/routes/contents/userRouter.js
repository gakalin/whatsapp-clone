const express = require('express');
const userRouter = express.Router();
const userController = require("../../controllers/userController");
const auth = require('../../middlewares/auth');

module.exports = (app) => {
    userRouter.post('/register', userController.register);
    userRouter.post('/login', userController.login);
    userRouter.get('/auth', userController.auth);
    userRouter.post('/googleAuth', userController.googleAuth);
    userRouter.post('/discordAuth', userController.discordAuth);
    userRouter.put('/logout', userController.logout);
    userRouter.put('/profile', auth, userController.profile);
    userRouter.get('/getUser', auth, userController.getUser);
    app.use('/user', userRouter);
}