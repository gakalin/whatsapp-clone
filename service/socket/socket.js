const SocketSchema = require('../db/schemas/SocketSchema');
const UserSchema = require('../db/schemas/UserSchema');

module.exports = (io) => {
    io.on('connection', (socket) => {
        // login
        socket.on('login', async (value) => {
            await SocketSchema.findOneAndDelete({ socketUserId: value._id });
            await SocketSchema.create({ 
                socketId: socket.id,
                socketUserId: value._id,
                socketUserName: value.userName,
            });
            let sockets = await SocketSchema.find({}).lean();
            io.emit('onlineList', sockets);
        });
        // disconnect
        socket.on('disconnect', async (data) => {
            await SocketSchema.findOneAndDelete({ socketId: socket.id });
            let sockets = await SocketSchema.find({}).lean();
            io.emit('onlineList', sockets);
        });
    })
};