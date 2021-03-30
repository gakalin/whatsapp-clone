const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocketSchema = new Schema({
    socketId: {
        type: String,
    },
    socketUserId: {
        type: String,
    },
    socketUserName: {
        type: String,
    }
});

module.exports = mongoose.model('socket', SocketSchema);