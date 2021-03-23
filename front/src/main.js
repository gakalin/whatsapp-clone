import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueCookies from 'vue-cookies';
import router from './router'
import store from './store'
import toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

Vue.config.productionTip = false
Vue.use(toast);
Vue.use(VueCookies);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
