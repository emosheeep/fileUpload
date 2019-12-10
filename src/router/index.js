import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index.vue'
import login from '../components/login/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ],
  mode: 'history'
})
