const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'E-mail required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    userName: {
        type: String,
        required: [true, 'Name required'],
        maxLength: [30, 'Name must be less than 30 characters'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password required'],
    },
    about: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
    },
    friends: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('user', UserSchema);