/**
 * 通过mutations间接更新state，这里的方法可以是异步的
 */
import {
  findTask, updateContact
} from '../api/api.js'
import type from './mutation-types'

export default {
  // 读取待提交清单信息
  [type.SET_TASK] ({commit, state}, callback) {
    findTask({
      creator: state.phone
    }).then(res => {
      commit(type.SET_TASK, res.data)
      callback && callback(res.data)
    }).catch(e => {
      console.error(e)
    })
  },
  // 异步更新联系人信息
  async [type.SET_CONTACT] ({commit, state}, payload) {
    let {toast, contact} = payload
    toast.loading({
      loadingType: 'spinner',
      duration: 0,
      message: '请稍后',
      forbidClick: true
    })
    try {
      let options = {
        condition: { phone: state.phone },
        data: { contact }
      }
      let result = await updateContact(options)
      if (result.status) {
        // 后台数据整体替换
        commit(type.SET_CONTACT, contact)
      }
    } catch (e) {
      console.error(e)
      toast.fail('同步失败')
    } finally {
      toast.clear() // 停止加载
    }
  }
}
