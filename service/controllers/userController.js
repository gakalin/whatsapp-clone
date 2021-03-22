const UserValidator = require('../validator/UserValidator');
const UserSchema = require('../db/schemas/UserSchema');
const bcrypt = require('bcrypt');

const userController = {};

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
        res.status(400).json({
            success: false,
            message: error,
        })
    }
};

module.exports = userController;