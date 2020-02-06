export default [
  {
    path: '/contact',
    name: 'contact',
    component: () => import(/* webpackChunkName: "contact" */ '../components/contact'),
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
        component: () => import(/* webpackChunkName: "contact" */ '../components/contact/groupList.vue')
      },
      {
        path: 'members',
        name: 'members',
        component: () => import(/* webpackChunkName: "contact" */ '../components/contact/groupUserList.vue'),
        props: route => ({ title: route.query.title })
      }
    ]
  }
]
