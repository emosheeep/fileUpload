import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/reset.css'
import Cookies from 'js-cookie'
import {
  NavBar, Cell, Button,
  Toast, Dialog, Icon
} from 'vant'

Vue.use(NavBar).use(Toast).use(Dialog).use(Cell).use(Button)
  .use(Icon)
Vue.config.productionTip = false
// 全局绑定cookie函数
Vue.prototype.$cookie = Cookies

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
