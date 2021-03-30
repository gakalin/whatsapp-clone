module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('a user just connected via socket');
    })
};