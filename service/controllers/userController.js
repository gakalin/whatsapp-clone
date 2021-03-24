const UserValidator = require('../validator/UserValidator');
const UserSchema = require('../db/schemas/UserSchema');
const LoginValidator = require('../validator/LoginValidator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const userController = {};

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
                redirect_uri: 'http://localhost:8080/login',
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
        }).then((result) => {
            console.log(result.data);
            // -
            return res.sendStatus(200);
        }).catch((error) => {
            console.log('err1', error);
            return res.sendStatus(203);
        });

    } catch (error) {
        console.log('err3', error);
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
            .then(() => {                
                jwt.sign({ payload: obj._id }, process.env.JWT_SECRETKEY, async (err, token) => {
                    if (err)
                        throw err;

                    obj.token = token;
                    res.cookie('chatAppAuth', token, {
                        maxAge: (60 * 60 * 24) * 1000,
                        httpOnly: true,
                    });

                    await UserSchema.findOneAndUpdate({ _id: obj._id}, { token }, { upsert: true });

                    return res.status(200).json({
                        success: true,
                        data: obj,
                    })
                })
            })
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
                }, (err, user) => {
                    if (err)
                        throw err;

                    return res.status(201).json({
                        success: true,
                        message: 'Registration completed',
                        data: user,
                    })
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