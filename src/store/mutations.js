/**
 * mutations直接修改数据对象state，注意这里的方法必须是同步方法
 */
import type from './mutation-types'

export default {
  // 设置大学信息
  [type.SET_UNIVERSITY] (state, data) {
    state.university = data
  }
}
