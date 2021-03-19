const express = require('express');
const mainRouter = express.Router();
const MainController = require("../../controllers/mainController");

module.exports = (app) => {
    mainRouter.get('/', MainController);
    app.use('/', mainRouter);
}