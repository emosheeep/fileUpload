import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index.vue'
import login from '../components/login/index.vue'
import todoList from '../components/business/todoList/todoList'
import myTask from '../components/business/myTask/myTask'
import contact from '../components/contact/index'
import download from '../components/business/download/download'
import preview from '../components/business/download/preview'

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
      path: '/myTask',
      name: 'myTask',
      component: myTask
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
      path: '/download',
      name: 'download',
      component: download
    },
    {
      path: '/preview',
      name: 'preview',
      component: preview,
      props: (route) => ({title: route.query.title})
    }
  ],
  mode: 'history'
})
