const validator = require('validator');
const yup = require('yup');

const UserSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .email('E-mail must be valid'),
    userName: yup
        .string()
        .trim()
        .min(2, 'Name must be equal or longer than 2 characters')
        .max(30, 'Name must be less than 30 characters'),
    password: yup
        .string()
        .trim()
        .test('strongPassword', 'Password needs to contain at least 1 number, 1 uppercase, 1 lowercase characters (min 6 chars)', value => validator.isStrongPassword(value, { minLength: 6, minLowercase: 1, minUpperCase: 1, minSymbols: 0, returnScore: false })),
    passwordConfirm: yup
        .array()
        .test('passwordConfirm', 'Passwords doesn\'t match', value => value[0] == value[1]),
    emailExisted: yup
        .boolean()
        .test('emailExisted', 'E-mail already taken', value => value == false),
});

module.exports = UserSchema;