import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

// 路由组件
import index from '../components/index.vue'
import home from '../components/home/home'
import explore from '../components/home/explore'
import info from '../components/home/info'
import login from '../components/login'
import todoList from '../components/business/todoList/todoList'
import myTask from '../components/business/task/taskList'
import files from '../components/business/download/files'
import preview from '../components/business/download/preview'
import addTask from '../components/business/task/addTask'
import task from '../components/business/task'
import taskDetail from '../components/business/task/taskDetail'
import contact from '../components/contact'
import groupList from '../components/contact/groupList'
import groupUserList from '../components/contact/groupUserList'

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
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/info',
      name: 'info',
      component: info
    },
    {
      path: '/task',
      name: 'task',
      beforeEnter: (to, from, next) => { // 跳转
        if (to.name === 'task') {
          next({name: 'list', replace: true})
        } else {
          next()
        }
      },
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
      path: '/contact',
      name: 'contact',
      component: contact,
      beforeEnter: (to, from, next) => { // 跳转
        if (to.name === 'contact') {
          next({name: 'groups', replace: true})
        } else {
          next()
        }
      },
      children: [
        {
          path: 'groups',
          name: 'groups',
          component: groupList
        },
        {
          path: 'members',
          name: 'members',
          component: groupUserList,
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
  if (Date.now() <= store.state.expires) {
    next()
  } else {
    if (to.name === 'login') {
      next()
    }
    next({name: 'login', replace: true})
    console.log('请先登录')
  }
})
