const UserSchema = require('../db/schemas/UserSchema');
const { v4: uuidv4 } = require('uuid');

const onlineList = async (io) => {
    let online = await UserSchema.find({ isOnline: true }).lean();
    io.emit('onlineList', online);
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        // login
        socket.on('login', async (data) => {
            await UserSchema.findOneAndUpdate({ _id: data._id }, { socketId: socket.id, isOnline: true }, { upsert: true });
            onlineList(io);
        });
        // disconnect
        socket.on('disconnect', async () => {
            await UserSchema.findOneAndUpdate({ socketId: socket.id }, { socketId: '', isOnline: false });
            onlineList(io);
        });

        // add friend
        socket.on('addFriend', async (data) => {
            let alreadySent = await UserSchema.find({ $and: [ { _id: data.to.userId }, { 'notifications.from': data.from._id } ] });

            if (alreadySent && alreadySent.length > 0) {
                return io.to(data.from.socketId).emit('sendToast', { type: 'error', message: 'You have already sent your request' });
            }

            let alreadyFriends = await UserSchema.find({ $and: [ { _id: data.to.userId }, { friends: data.from_id } ]});

            if (alreadyFriends && alreadyFriends.length > 0) {
                return io.to(data.from.socketId).emit('sendToast', { type: 'error', message: 'You are already a friend.'})
            }
            
            let obj = { id: uuidv4(), from: data.from._id, name: data.from.name, type: 'friend_request', date: Date.now() };

            await UserSchema.findOneAndUpdate({ _id: data.to.userId }, { $push: { notifications: obj }});
            io.to(data.to.socketId).emit('sendNotifications', obj);

            io.to(data.from.socketId).emit('sendToast', { type: 'success', message: 'Your friend request has been sent!'});
            io.to(data.to.socketId).emit('sendToast', { type: 'warning', message: 'You have a new friend request!'});
            
        });

        // socket id updating
        socket.on('updateSocketId', async (data) => {
            await UserSchema.findOneAndUpdate( { _id: data }, { socketId: socket.id });
            socket.emit('updateSocketId', socket.id);
        });

        // friend request accepting
        socket.on('acceptFriendRequest', async (data) => {

        });

        // friend request declining
        socket.on('declineFriendRequest', async (data) => {

        });
    });
};