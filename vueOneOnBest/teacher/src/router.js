import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Cocos from './views/Cocos.vue'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/home',
      component: Home
    },

    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/game',
      name: 'game',
      component: Cocos
    }
  ]
})

export default router