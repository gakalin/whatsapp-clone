import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    'userId': null,
    'email': null,
    'userName': null,
    'userAbout': null,
    'userAvatar': null,
    'userFriends': [],
    'token': null,
    'onlineList': [],
    'notifications': [],
    'friends': [],
    'friendsFiltered': [],
  },
  getters: {
    notificationCount(state) {
      return state.notifications.length > 0 ? state.notifications.filter(e => e.read == false).length : 0;
    },
    avatar(state) {
      let avatar = require('../assets/blank_avatar.jpg');
      if (state.userAvatar) {
        if (state.userAvatar.length == 36)
          avatar = require(`${process.env.VUE_APP_UPLOADDIR}/${state.userAvatar}`);
        else 
          avatar = state.userAvatar;
      }
      return avatar;
    },
    userName(state) {
      return state.userName;
    },
    onlineList(state) {
      return state.onlineList;
    },
    notifications(state) {
      return state.notifications;
    }
  },
  mutations: {
    getFriends(state) {
      if (state.userFriends.length > 0) {
        var arr = [];

        state.userFriends.forEach(element => {
          Vue.axios({ url: `/user/getUser?id=${element}`, method: 'get'})
          .then((result) => {
            if (result.data.success) {
              arr.push({ _id: result.data.user._id, userName: result.data.user.userName, isOnline: result.data.user.isOnline, socketId: result.data.user.socketId });
            }
          });      
        });

        state.friends = arr;
        state.friendsFiltered = state.friends;
      }
    },
    filterFriends(state, v) {
      if (v == 1)
        state.friendsFiltered = state.friends.filter(f => f.isOnline == true);
      else if (v == 2) 
        state.friendsFiltered = state.friends.filter(f => f.isOnline == false);
      else if (v == 3)
        state.friendsFiltered = state.friends;
    },
    updateFriends(state, data) {
      state.friends = [];
      state.friendsFiltered = [];
      state.userFriends = data;
      var arr = [];

      state.userFriends.forEach(element => {
        Vue.axios({ url: `/user/getUser?id=${element}`, method: 'get'})
        .then((result) => {
          if (result.data.success) {
            arr.push({ _id: result.data.user._id, userName: result.data.user.userName, isOnline: result.data.user.isOnline, socketId: result.data.user.socketId });
          }
        });      
      });

      state.friends = arr;
      state.friendsFiltered = state.friends;
    },
    updateNotifications(state, data) {
      state.notifications = data;
    },
    updateSocketId(state, data) {
      state.socketId = data;
    },
    showToast(state, data) {
      if (data.type == 'success') {
        Vue.$toast.success(data.message);
      } else if (data.type == 'error') {
        Vue.$toast.error(data.message);
      } else if (data.type == 'warning') {
        Vue.$toast.warning(data.message);
      }
    },
    addNotification(state, data) {
      state.notifications.push(data);
    },
    setOnlineList(state, data) {
      state.onlineList = data.filter(d => d._id != state.userId);
    },
    deleteUserInfos(state) {
      state.userId = null;
      state.email = null;
      state.userName = null;
      state.userAbout = null;
      state.userAvatar = null;
      state.userFriends = null;
      state.token = null;
      state.socketId = null;
      state.onlineList = [];
      state.notifications = [];
      router.go({ name: 'Login '}).catch(() => {});
    },
    setUserInfos(state, data) {
      state.userId = data._id;
      state.email = data.email;
      state.userName = data.userName;
      state.userAbout = data.about;
      state.userAvatar = data.avatar;
      state.userFriends = data.friends;
      state.token = data.token;
      state.socketId = data.socketId;
      state.notifications = data.notifications;
    }
  },
  actions: {
    removeFriend({ state }, id) {
      this._vm.$socket.client.emit('removeFriend', id);
    },
    readAllNotifications({ getters }) {
      if (getters.notificationCount > 0)
        this._vm.$socket.client.emit('readAllNotifications');
    },
    socket_updateFriends({ commit }, data) {
      commit('updateFriends', data);
    },
    socket_updateNotifications({ commit }, data) {
      commit('updateNotifications', data);
    },
    acceptFriendRequest({ state }, id) {
      this._vm.$socket.client.emit('acceptFriendRequest', { id, socketId: state.socketId });
    },
    declineFriendRequest({ state }, id) {
      this._vm.$socket.client.emit('declineFriendRequest', { id, socketId: state.socketId });
    },
    socket_updateSocketId({ commit }, data) {
      commit('updateSocketId', data);
    },
    updateSocketId({ state }) { 
      this._vm.$socket.client.emit('updateSocketId', state.userId);
    },
    socket_sendToast({ commit }, data) {
      commit('showToast', data);
    },
    socket_sendNotifications({ commit }, data) {
      commit('addNotification', data);
    },
    addFriend({ state }, to) {
      this._vm.$socket.client.emit("addFriend", { from: { _id: state.userId, name: state.userName, socketId: state.socketId }, to });
    },
    socket_onlineList({ commit }, data) {
      commit('setOnlineList', data);
    },
    logout({ commit }) {
      Vue.axios({ url: '/user/logout', method: 'put'})
        .then(() => {
          commit('deleteUserInfos');
        })
    },
    changeName({ commit }, data) {
      Vue.axios({ url: '/user/profile', method: 'put', data: { userName: data }})
        .then((result) => {
          if (result.data.success) {
            Vue.$toast.success('Your profile updated successfully');
            commit('setUserInfos', result.data.data);
          }
        })
        .catch(() => {
          Vue.$toast.error('There are some errors while updating your profile');
        })
    },
    changeAvatar({ commit }, data) {
      Vue.axios({ url: '/user/profile', method: 'put', data }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      }).then((result) => {
        if (result.data.success) {
          Vue.$toast.success('Your avatar changed successfully');
          commit('setUserInfos', result.data.data);
          router.go({ name: 'App' });
        } else {
          Vue.$toast.error('There are some errors while uploading your new avatar');
        }
      }).catch(() => {
        Vue.$toast.error('There are some errors while uploading your new avatar');
      });
    }
  }
})
