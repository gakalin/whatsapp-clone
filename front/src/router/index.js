import Vue from 'vue'
import VueRouter from 'vue-router'

import MainRouter from '../views/Main.vue'
import LoginRouter from '../views/Login.vue';

Vue.use(VueRouter)

const routes = [

  {
    path: '/app',
    name: 'App',
    component: MainRouter,
  },
  {
    path: '/login/:app?',
    name: 'Login',
    component: LoginRouter,
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
