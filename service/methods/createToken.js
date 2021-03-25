const jwt = require('jsonwebtoken');

module.exports = async (payload) => {
    return await jwt.sign({ payload }, process.env.JWT_SECRETKEY);
}