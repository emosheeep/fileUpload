// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/reset.css'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import Cookies from 'js-cookie'

Vue.use(Vant)
Vue.config.productionTip = false

// 全局绑定cookie函数
Vue.prototype.$cookie = Cookies

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
