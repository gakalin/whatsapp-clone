const mainRouter = require('./contents/mainRouter');
const userRouter = require('./contents/userRouter');

module.exports = (app) => {
    mainRouter(app);
    userRouter(app);
}