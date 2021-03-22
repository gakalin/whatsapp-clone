const mongoose = require('mongoose');

module.exports = () => {
    try {
        mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        mongoose.connection
            .on('open', () => {
                console.log('mongodb connected');
            })
            .on('error', (error) => {
                console.error(error);
            })
    } catch (error) {
        console.error(error);
    }
}