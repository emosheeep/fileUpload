/**
 * mutations直接修改数据对象state，注意这里的方法必须是同步方法
 */
import type from './mutation-types'

export default {
  // 设置用户信息
  [type.UPDATE_USER] (state, data = {}) {
    for (let key in state) {
      if (data[key]) {
        state[key] = data[key]
      }
    }
  },
  // 清除用户信息
  [type.CLEAR_USER] (state) {
    state.username = ''
    state.studentID = ''
    state.phone = ''
    state.university.name = ''
    state.university.id = ''
    state.contact = []
    state.task = []
  },
  // 设置contact
  [type.SET_CONTACT] (state, contact) {
    state.contact = contact
  },
  // 设置task
  [type.SET_TASK] (state, task) {
    state.task = task
  },
  // 设置todoList
  [type.SET_TODOLIST] (state, todoList) {
    state.todoList = todoList
  }
}
