const UserValidator = require('../validator/UserValidator');
const UserSchema = require('../db/schemas/UserSchema');
const LoginValidator = require('../validator/LoginValidator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {};

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
                jwt.sign({ payload: obj._id }, process.env.JWT_SECRETKEY, (err, token) => {
                    if (err)
                        throw err;

                    obj.token = token;
                    res.cookie('chatAppAuth', token, {
                        maxAge: (60 * 60 * 24) * 1000,
                        httpOnly: true,
                    });

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
        res.status(401).json({
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
        res.status(401).json({
            success: false,
            message: error,
        })
    }
};

module.exports = userController;