const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    users: {
        type: Array,
    },
    messages: [
        {
            userId: mongoose.ObjectId,
            read: Boolean,
            date: Date,
            content: String,
        }
    ]
});

module.exports = mongoose.model('message', MessageSchema);