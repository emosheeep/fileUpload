import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'
import './assets/reset.css'
import 'animate.css'
import Cookies from 'js-cookie'

Vue.config.productionTip = false
// 全局绑定cookie函数
Vue.prototype.$cookie = Cookies

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// animateCSS
Vue.prototype.$animationCSS = function (element, animationName, callback) {
  const node = typeof element === 'object' ? element : document.querySelector(element)
  node.classList.add('animated', animationName)
  node.addEventListener('animationend', function handler () {
    node.classList.remove('animated', animationName)
    node.removeEventListener('animationend', handler)

    if (typeof callback === 'function') callback()
  })
}
