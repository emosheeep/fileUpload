import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

// 路由组件
import index from '../components/index.vue'
import home from '../components/home/home'
import explore from '../components/home/explore'
import info from '../components/home/info'
import login from '../components/login/index.vue'
import todoList from '../components/business/todoList/todoList'
import myTask from '../components/business/task/taskList'
import contact from '../components/contact/index'
import files from '../components/business/download/files'
import preview from '../components/business/download/preview'
import addTask from '../components/business/task/addTask'
import task from '../components/business/task/index'
import taskDetail from '../components/business/task/taskDetail'

Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/',
      component: index,
      beforeEnter: (to, from, next) => { // 跳转
        if (to.fullPath === '/') {
          next({name: 'home', replace: true})
        } else {
          next()
        }
      },
      children: [
        {
          path: 'explore',
          name: 'explore',
          component: explore
        },
        {
          path: 'home',
          name: 'home',
          component: home
        }
      ]
    },
    {
      path: '/info',
      name: 'info',
      component: info
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/task',
      name: 'task',
      component: task,
      children: [
        {
          path: 'list',
          name: 'list',
          component: myTask
        },
        {
          path: 'addTask',
          name: 'addTask',
          component: addTask
        },
        {
          path: 'detail',
          name: 'detail',
          component: taskDetail,
          props: route => ({title: route.query.title})
        }
      ]
    },
    {
      path: '/todoList',
      name: 'todoList',
      component: todoList
    },
    {
      path: '/contact',
      name: 'contact',
      component: contact
    },
    {
      path: '/files',
      name: 'files',
      component: files
    },
    {
      path: '/preview',
      name: 'preview',
      component: preview,
      props: route => ({title: route.query.title})
    }
  ],
  mode: 'history'
})

// 全局路由拦截（主要针对登陆状态, 判断是否具有后端token）
router.beforeEach((to, from, next) => {
  if (store.state.token.length !== 0) {
    next()
  } else {
    if (to.name === 'login') {
      next()
    }
    next({name: 'login', replace: true})
    console.log('请先登录')
  }
})
