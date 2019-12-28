import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index.vue'
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

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: index
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
