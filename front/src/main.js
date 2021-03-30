import Vue from 'vue'
require('dotenv').config();
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies';
import router from './router'
import store from './store'
import toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import VueSocketIOExt from 'vue-socket.io-extended'
import { io } from 'socket.io-client'

const socket = io(process.env.VUE_APP_SERVICEURL, { transports: ['websocket', 'polling', 'flashsocket'] });

Vue.config.productionTip = false
Vue.use(toast);
Vue.use(VueCookies);
Vue.use(VueSocketIOExt, socket);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
  sockets: {
    connect() {
      //console.log('socket connected');
    }
  }
}).$mount('#app')
