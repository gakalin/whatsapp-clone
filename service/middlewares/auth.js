const UserSchema = require('../db/schemas/UserSchema');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        if (!req.cookies.chatAppAuth)
            return res.sendStatus(203);
        
        jwt.verify(req.cookies.chatAppAuth, process.env.JWT_SECRETKEY, async(err, data) => {
            if (!err && data) {
                let _id = data.payload;
                let user = await UserSchema.find({ $and: [{ _id }, { token: req.cookies.chatAppAuth }] }).exec();

                if (!user || user.length < 1) {
                    res.clearCookie('chatAppAuth');
                    return res.sendStatus(203);
                }

                res.locals.userId = _id;
                next();
                
            } else
                return res.sendStatus(203);
        })
    } catch (error) {
        return res.sendStatus(203);
    }
};