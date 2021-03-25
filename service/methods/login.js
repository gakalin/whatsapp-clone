const UserSchema = require('../db/schemas/UserSchema');
const createToken = require('./createToken');

module.exports = async (user, res) => {
    let token = await createToken(user._id);
    user.token = token;
    await UserSchema.findOneAndUpdate({ _id: user._id}, { token }, { upsert: true });

    res.cookie('chatAppAuth', token, {
        maxAge: (60 * 60 * 24) * 1000,
        httpOnly: true,
    });

    return res.status(200).json({
        success: true,
        data: user,
    });
}