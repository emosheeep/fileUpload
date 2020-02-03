import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import home from './home'
import task from './task'
import contact from './contact'

Vue.use(VueRouter)

const routes = [
  home,
  task,
  contact,
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/login')
  },
  {
    path: '/info',
    name: 'info',
    component: () => import('../components/home/info.vue')
  },
  {
    path: '/todoList',
    name: 'todoList',
    component: () => import('../components/business/todoList/todoList.vue')
  },
  {
    path: '/files',
    name: 'files',
    component: () => import('../components/business/download/files.vue')
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import('../components/business/download/preview.vue'),
    props: route => ({ title: route.query.title })
  }
]

const router = new VueRouter({
  mode: 'hash',
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
