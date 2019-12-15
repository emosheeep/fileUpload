/**
 * 通过mutations间接更新state，这里的方法可以是异步的
 */
import {
  updateContact, addTask
} from '../api/api.js'
import type from './mutation-types'

export default {
  // 同步联系人信息
  [type.SET_CONTACT] ({commit, state}, contact) {
    commit(type.SET_CONTACT, contact)
    let options = {
      condition: { phone: state.phone },
      data: {
        contact: state.contact
      }
    }
    updateContact(options).then(res => {
      console.log(res.msg)
    }).catch(errHandler)
  },
  // 同步任务信息
  [type.SET_TASK] ({commit, state}, task) {
    commit(type.SET_TASK, task)
    let options = {
      condition: { phone: state.phone },
      data: {
        task: state.task
      }
    }
    addTask(options).then(res => {
      console.log(res.msg)
    }).catch(errHandler)
  }
}

function errHandler (err) {
  console.error(err)
  this.$toast.fail('同步失败')
}
