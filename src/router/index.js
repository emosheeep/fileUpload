import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/index.vue'),
    beforeEnter: (to, from, next) => { // 跳转
      if (to.fullPath === '/') {
        next({ name: 'home', replace: true })
      } else {
        next()
      }
    },
    children: [
      {
        path: 'explore',
        name: 'explore',
        component: () => import('../components/home/explore')
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('../components/home/home')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/login')
  },
  {
    path: '/info',
    name: 'info',
    component: () => import('../components/home/info')
  },
  {
    path: '/task',
    name: 'task',
    component: () => import('../components/business/task'),
    beforeEnter: (to, from, next) => { // 跳转
      if (to.name === 'task') {
        next({ name: 'list', replace: true })
      } else {
        next()
      }
    },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('../components/business/task/taskList')
      },
      {
        path: 'addTask',
        name: 'addTask',
        component: () => import('../components/business/task/addTask')
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('../components/business/task/taskDetail'),
        props: route => ({ title: route.query.title })
      }
    ]
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../components/contact'),
    beforeEnter: (to, from, next) => { // 跳转
      if (to.name === 'contact') {
        next({ name: 'groups', replace: true })
      } else {
        next()
      }
    },
    children: [
      {
        path: 'groups',
        name: 'groups',
        component: () => import('../components/contact/groupList')
      },
      {
        path: 'members',
        name: 'members',
        component: () => import('../components/contact/groupUserList'),
        props: route => ({ title: route.query.title })
      }
    ]
  },
  {
    path: '/todoList',
    name: 'todoList',
    component: () => import('../components/business/todoList/todoList')
  },
  {
    path: '/files',
    name: 'files',
    component: () => import('../components/business/download/files')
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import('../components/business/download/preview'),
    props: route => ({ title: route.query.title })
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
