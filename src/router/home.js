export default {
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
      component: () => import('../components/home/explore.vue')
    },
    {
      path: 'home',
      name: 'home',
      component: () => import('../components/home/home.vue')
    }
  ]
}
