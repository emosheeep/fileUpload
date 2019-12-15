/**
 * 通过mutations间接更新state，这里的方法可以是异步的
 */
import {
  updateContact, addTask
} from '../api/api.js'
import type from './mutation-types'

export default {
  /**
   * 注意：同步操作应该先更新远程数据，成功之后再更新本地数据
   * 如果远程更新失败，本地还有备份保险，commit应该在成功回调中执行
   */
  // 同步联系人信息
  [type.SET_CONTACT] ({commit, state}, payload) {
    let options = {
      condition: { phone: state.phone },
      data: {
        contact: payload.data
      }
    }
    updateContact(options).then(res => {
      commit(type.SET_CONTACT, payload.data)
      console.log(res.msg)
    }).catch(payload.errCallback)
  },
  // 同步任务信息
  [type.SET_TASK] ({commit, state}, payload) {
    let options = {
      condition: { phone: state.phone },
      data: {
        task: payload.data
      }
    }
    addTask(options).then(res => {
      commit(type.SET_TASK, payload.data)
      console.log(res.msg)
    }).catch(payload.errCallback)
  }
}
