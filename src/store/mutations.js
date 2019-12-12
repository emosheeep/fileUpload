/**
 * mutations直接修改数据对象state，注意这里的方法必须是同步方法
 */
import type from './mutation-types'

export default {
  // 设置大学信息
  [type.UPDATE_USER] (state, data = {}) {
    for (let key in state) {
      if (data[key]) {
        state[key] = data[key]
      }
    }
  },
  [type.CLEAR_USER] (state) {
    state.username = ''
    state.studentID = ''
    state.phone = ''
    state.university.name = ''
    state.university.id = ''
  }
}
