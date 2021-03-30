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
  },
  getters: {
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
  },
  mutations: {
    setOnlineList(state, data) {
      state.onlineList = data;
    },
    deleteUserInfos(state) {
      state.userId = null;
      state.email = null;
      state.userName = null;
      state.userAbout = null;
      state.userAvatar = null;
      state.userFriends = null;
      state.token = null;
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
    }
  },
  actions: {
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
