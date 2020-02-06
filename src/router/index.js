import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import home from './home'
import task from './task'
import contact from './contact'
import download from './download'
import todolist from './todolist'

Vue.use(VueRouter)

const routes = [
  ...home,
  ...task,
  ...contact,
  ...download,
  ...todolist,
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../components/login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局路由拦截（主要针对登陆状态）
router.beforeEach((to, from, next) => {
  // 判断是否过期
  if (Date.now() <= store.state.expires) {
    next()
  } else {
    if (to.name === 'login') {
      next()
    } else {
      next({ name: 'login', replace: true })
      console.log('请先登录')
    }
  }
})

export default router
