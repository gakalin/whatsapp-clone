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
  },
  getters: {
    avatar(state) {
      return !state.userAvatar ? require('../assets/blank_avatar.jpg') : state.userAvatar;
    },
    userName(state) {
      return state.userName;
    }
  },
  mutations: {
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
    logout({ commit }) {
      Vue.axios({ url: '/user/logout', method: 'put'})
        .then(() => {
          commit('deleteUserInfos');
        })
    },
    changeName() {
      console.log('name change');
    },
  }
})
