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
            UserSchema.find({ 'notifications.id': data.id}, async (err, user) => {
                if (err || !user) {
                    return io.to(data.socketId).emit('sendToast', { type: 'error', message: 'An error occured, please try again'});
                }
                try {

                    if (user[0] === undefined) return;

                    let request = user[0].notifications.find(n => n.id === data.id);
                    
                    if (user[0].friends.find(n => n == request.from)) {
                        socket.emit('sendToast', { type: 'error', message: `You are already friends with ${request.name}`});

                        let updatedUser = await UserSchema.findOneAndUpdate({ _id: user[0]._id }, { $pull: { notifications: { id: request.id }}}, { new: true });
                        
                        return socket.emit('updateNotifications', updatedUser.notifications);
                    }

                    let requestUserNew = await UserSchema.findOneAndUpdate({ _id: request.from }, { $push: { friends: user[0]._id }}, { new: true });

                    await UserSchema.findOneAndUpdate({ _id: user[0]._id }, { $push: { friends: request.from }});

                    let socketUserNew = await UserSchema.findOneAndUpdate({ _id: user[0]._id }, { $pull: { notifications: { id: request.id }}}, { new: true });

                    socket.emit('sendToast', { type: 'success', message: `You are friends with ${request.name} now!`});

                    if (socketUserNew !== undefined) {
                        socket.emit('updateNotifications', socketUserNew.notifications);
                        socket.emit('updateFriends', socketUserNew.friends);
                    }                    

                    if (requestUserNew !== undefined) {

                        if (requestUserNew.isOnline == true && requestUserNew.socketId) {
                            io.to(requestUserNew.socketId).emit('sendToast', { type: 'success', message: `You are friends with ${socketUserNew.userName} now`});

                            io.to(requestUserNew.socketId).emit('updateNotifications', requestUserNew.notifications);
                            io.to(requestUserNew.socketId).emit('updateFriends', requestUserNew.friends);
                        }

                    }                    


                } catch (error) {
                    console.error(error);
                }
            })
        });

        // friend request declining
        socket.on('declineFriendRequest', async (data) => {
            UserSchema.find({ 'notifications.id': data.id}, (err, user) => {
                if (err || !user) {
                    return io.to(data.socketId).emit('sendToast', { type: 'error', message: 'An error occured, please try again'});
                }
            })
        });
    });
};