const validator = require('validator');
const yup = require('yup');

const LoginSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .email('E-mail must be valid'),
    password: yup
        .string()
        .trim(),
    userExisted: yup
        .boolean()
        .test('userExisted', 'Couldn\t find email', value => value == true),
    passwordCheck: yup
        .boolean()
        .test('passwordCheck', 'Wrong password', value => value == true),
});

module.exports = LoginSchema;