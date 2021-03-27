const yup = require('yup');

const UserProfileSchema = yup.object().shape({
    userName: yup
        .string()
        .trim()
        .min(2, 'Name must be equal or longer than 2 characters')
        .max(30, 'Name must be less than 30 characters'),
});

module.exports = UserProfileSchema;