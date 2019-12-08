/*
vuex最核心的管理对象store, 导出store对象
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  plugins: debug ? [createLogger()] : [] // 调试插件，控制台打印具体信息
})
