export default [
  {
    path: '/info',
    name: 'info',
    component: () => import(/* webpackChunkName: "home" */ '../components/home/info.vue')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../views/index.vue'),
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
        component: () => import(/* webpackChunkName: "home" */ '../components/home/explore.vue')
      },
      {
        path: 'home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../components/home/home.vue')
      }
    ]
  }
]
