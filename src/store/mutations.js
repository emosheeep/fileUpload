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
    state.expires = ''
    state.token = ''
    state.domain = ''
    state.username = ''
    state.studentID = ''
    state.phone = ''
    state.university.name = ''
    state.university.id = ''
    state.contact = []
    state.task = []
    state.todoList = []
    console.log('用户信息已清除')
  },
  // 设置contact
  [type.SET_CONTACT] (state, contact) {
    state.contact = contact
  },
  // 新增task
  [type.ADD_TASK] (state, task) {
    state.task.push(task)
  },
  // 替换task
  [type.SET_TASK] (state, task) {
    state.task = task
  },
  // 删除task
  [type.DELETE_TASK] (state, task) {
    console.log(task)
    let position = state.task.findIndex(item => item.id === task.id)
    // TODO: 解决这里的报错
    try {
      state.task.splice(position, 1)
    } catch (e) {
      console.log(e)
    }
  },
  // 更新task
  [type.UPDATE_TASK] (state, task) {
    state.task = state.task.map(item => {
      return task.id === item.id ? task : item
    })
  },
  // 设置todoList
  [type.SET_TODOLIST] (state, todoList) {
    state.todoList = todoList
  },
  // 服务器端更新手机号码之后，本地同步更新任务和待提交清单
  [type.SET_USER_BY_PHONE] (state, phone) {
    // 更新每个任务的创建人信息
    state.task = state.task.map(item => {
      item.creator = phone
      return item
    })
    // 同理
    state.todoList = state.task.map(item => {
      item.creator = phone
      return item
    })
  },
  [type.SET_AVATAR] (state, filename) {
    state.avatar = filename
  },
  [type.SET_BACKGROUND] (state, filename) {
    state.background = filename
  }
}
