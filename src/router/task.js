export default {
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
      component: () => import('../components/business/task/taskList.vue')
    },
    {
      path: 'addTask',
      name: 'addTask',
      component: () => import('../components/business/task/addTask.vue')
    },
    {
      path: 'detail',
      name: 'detail',
      component: () => import('../components/business/task/taskDetail.vue'),
      props: route => ({ title: route.query.title })
    }
  ]
}
