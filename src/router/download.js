export default [
  {
    path: '/files',
    name: 'files',
    component: () => import(/* webpackChunkName: "download" */ '../components/business/download/files.vue')
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import(/* webpackChunkName: "download" */ '../components/business/download/preview.vue'),
    props: route => ({ title: route.query.title })
  }
]
