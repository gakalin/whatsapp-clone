import Vue from 'vue'
import Vuex from 'vuex'

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
    
  }
})
