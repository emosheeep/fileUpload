import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

// 路由组件
import index from '../components/index.vue'
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
      name: 'home',
      component: index
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

// 路由拦截（登陆状态）
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
