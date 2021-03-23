import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    'userId': null,
    'userName': null,
    'userAbout': null,
    'userAvatar': null,
    'userFriends': [],
    'token': null,
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  }
})
