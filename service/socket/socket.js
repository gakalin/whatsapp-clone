const UserSchema = require('../db/schemas/UserSchema');

const onlineList = async (io) => {
    let online = await UserSchema.find({ isOnline: true }).lean();
    io.emit('onlineList', online);
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        // login
        socket.on('login', async (value) => {
            await UserSchema.findOneAndUpdate({ _id: value._id }, { socketId: socket.id, isOnline: true }, { upsert: true });
            onlineList(io);
        });
        // disconnect
        socket.on('disconnect', async (data) => {
            await UserSchema.findOneAndUpdate({ socketId: socket.id }, { socketId: '', isOnline: false });
            onlineList(io);
        });

        socket.on('addFriend', async (data) => {
            await UserSchema.findOneAndUpdate({ socketId: data.to }, { notifications: { from: data.from, type: 'friend_request', date: Date.now() } }, { upsert: true });
            io.to(data.to).emit("sendNotifications", { from: data.from, type: 'friend_request', date: Date.now() });
        });
    })
};