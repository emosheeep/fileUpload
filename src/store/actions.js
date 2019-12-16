/**
 * 通过mutations间接更新state，这里的方法可以是异步的
 */
import {
  todoList
} from '../api/api.js'
import type from './mutation-types'

export default {
  // 读取待提交清单信息
  [type.SET_TODOLIST] ({commit, state}) {
    todoList({
      studentID: state.studentID
    }).then(res => {
      console.log(res)
      commit(type.SET_TODOLIST, res.data)
    }).catch(e => {
      console.error(e)
    })
  }
}
