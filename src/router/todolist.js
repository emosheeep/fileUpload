export default [
  {
    path: '/todoList',
    name: 'todoList',
    component: () => import(/* webpackChunkName: "todoList" */ '../components/business/todoList/todoList.vue')
  }
]
