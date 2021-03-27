const UserValidator = require('../validator/UserValidator');
const UserProfileValidator = require('../validator/UserProfileValidator');
const UserSchema = require('../db/schemas/UserSchema');
const LoginValidator = require('../validator/LoginValidator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const login = require('../methods/login');
const discordOauth2 = require('discord-oauth2');
const oauth = new discordOauth2();

const userController = {};

/* Profile Data Update */
userController.profile = (req, res) => {
    try {
        if (!res.locals.userId)
            return res.sendStatus(204);

        if (req.body.userName) {
            UserProfileValidator.validate(req.body, { abortEarly: false })
                .then(async () => {
                    let user = await UserSchema.findOneAndUpdate({ _id: res.locals.userId }, req.body);

                    if (!user) {
                        return res.status(400).json({
                            success: false,
                            message: error.errors,
                        });   
                    } else {
                        return res.status(200).json({
                            success: true,
                            data: user,
                        });
                    }
                })
                .catch((error) => {
                    return res.status(400).json({
                        success: false,
                        message: error.errors,
                    });  
                });
        } else {
            console.log(req.files);
            return res.sendStatus(200);
        }
        
    } catch (error) {
        return res.sendStatus(204);
    }
};

/* Logout */
userController.logout = (req, res) => {
    try {
        if (!req.cookies.chatAppAuth)
            return res.sendStatus(204);

        jwt.verify(req.cookies.chatAppAuth, process.env.JWT_SECRETKEY, async (err, data) => {
            if (err || !data)
                return res.sendStatus(204);

            await UserSchema.findOneAndUpdate({ _id: data.payload }, { token: '' })
            res.clearCookie('chatAppAuth');
            return res.sendStatus(200);
        });
    } catch (error) {
        return res.sendStatus(204);
    }
};

/* Discord Auth */
userController.discordAuth = async (req, res) => {
    try {
        if (!req.body.code)
            return res.sendStatus(203);

        oauth.tokenRequest({
            clientId: process.env.DISCORD_CLIENTID,
            clientSecret: process.env.DISCORD_SECRET,
            code: req.body.code,
            scope: ['identify', 'email'],
            grantType: 'authorization_code',
            redirectUri: process.env.DISCORD_REDIRECTURI,
        }).then(async (data) => {
            if (!data)
                return res.sendStatus(203);
            
            let user = await oauth.getUser(data.access_token);

            if (!user)
                return res.sendStatus(203);

            let userExisted = await UserSchema.find({ email: user.email });
            if (userExisted[0])
                login(userExisted[0], res);
            else {
                UserSchema.create({
                    email: user.email,
                    userName: user.username,
                    avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`,
                    about: '',
                    friends: [],
                }, async (err, newUser) => {
                    if (err)
                        return res.sendStatus(203);
                    
                    await login(newUser, res);                
                })
            }
        })
    } catch (error) {
        return res.sendStatus(203);
    }
}

/* Google Auth */
userController.googleAuth = async (req, res) => {
    try {
        if (!req.body.code)
            return res.sendStatus(203);
        
        let { data } = await axios({
            url: 'https://oauth2.googleapis.com/token',
            method: 'post',
            data: {
                client_id: process.env.GOOGLE_CLIENTID,
                client_secret: process.env.GOOGLE_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECTURI,
                grant_type: 'authorization_code',
                code: req.body.code,
            }
        });

        axios({
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            method: 'get',
            headers: {
                Authorization: `Bearer ${data.access_token}`,
            },
        }).then(async (result) => {
            let userExisted = await UserSchema.find({ email: result.data.email });
            if (userExisted[0]) {
                await login(userExisted[0], res);  
            } else {
                UserSchema.create({
                    email: result.data.email,
                    userName: result.data.name,
                    avatar: result.data.picture,
                    about: '',
                    friends: [],
                }, async (err, user) => {
                    if (err)
                        return res.sendStatus(203);

                    await login(user, res);
                });
            }
        }).catch((error) => {
            return res.sendStatus(203);
        });

    } catch (error) {
        return res.sendStatus(203);
    }
};

/* Auth */
userController.auth = async (req, res) => {
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

                let obj = {...user[0]._doc};
                if (obj.password)
                    delete obj.password;
                    
                obj.token = req.cookies.chatAppAuth;
                return res.status(200).json({
                    success: true,
                    data: obj,
                })
            } else
                return res.sendStatus(203);
        })
    } catch (error) {
        return res.sendStatus(203);
    }
};

/* User Login */
userController.login = async (req, res) => {
    try {
        if (req.cookies.chatAppAuth)
            return res.sendStatus(400);

        let email = typeof req.body.email !== 'undefined' ? req.body.email : '';
        let password = typeof req.body.password !== 'undefined' ? req.body.password : '';

        let user = await UserSchema.find({ email }).exec();
        let hashedPassword = '';
        let obj = {};

        if (typeof user[0] !== 'undefined') {
            hashedPassword = user[0].password;
            obj = {...user[0]._doc};
            delete obj.password;
        }

        LoginValidator
            .validate({
                email: req.body.email,
                password: req.body.password,
                userExisted: user ? true: false,
                passwordCheck: bcrypt.compareSync(password,hashedPassword),
            }, {
                abortEarly: true,
            })
            .then(async () => await login(obj, res))
            .catch((error) => {
                return res.status(401).json({
                    success: false,
                    message: error.errors,
                });  
            })
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error,
        });       
    }
};

/* User Registration */
userController.register = async (req, res) => {
    try {
        UserValidator
            .validate({
                email: req.body.email,
                userName: req.body.userName,
                password: req.body.password,
                passwordConfirm: [req.body.password, req.body.passwordConfirm],
                emailExisted: await UserSchema.findOne({ email: req.body.email }).exec() ? true : false
            }, 
            { 
                abortEarly: false 
            })
            .then(() => {
                UserSchema.create({
                    email: req.body.email,
                    userName: req.body.userName,
                    password: bcrypt.hashSync(req.body.password, 12),
                    about: '',
                    avatar: '',
                }, async (err, user) => {
                    if (err)
                        throw err;

                    await login(user, res);
                })
            })
            .catch((error) => {
                return res.status(422).json({
                    success: false,
                    message: error.errors,
                })
            })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error,
        })
    }
};

module.exports = userController;