/**
 * 通过mutations间接更新state，这里的方法可以是异步的
 */
import {
  findTask, updateContact,
  updateAvatar, updateBackground
} from '../api/api.js'
import type from './mutation-types'

export default {
  // 读取待提交清单信息
  [type.SET_TASK] ({ commit, state }, callback) {
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
  [type.SET_CONTACT] ({ commit, state }, payload) {
    const { vm, contact } = payload
    vm.$toast.loading({
      loadingType: 'spinner',
      duration: 0,
      message: '请稍后',
      forbidClick: true
    })
    updateContact({
      condition: { phone: state.phone },
      data: { contact }
    }).then(result => {
      if (result.status) {
        // 后台数据整体替换
        commit(type.SET_CONTACT, contact)
      }
      vm.$toast.clear() // 停止加载
    }).catch(e => {
      vm.$toast.fail('同步失败')
    })
  },
  // 更新头像
  [type.SET_AVATAR] ({ commit, state }, payload) {
    const { toast, filename } = payload
    toast.loading({
      loadingType: 'spinner',
      duration: 0,
      message: '请稍后',
      forbidClick: true
    })
    updateAvatar({
      phone: state.phone,
      avatar: filename
    }).then(res => {
      commit(type.SET_AVATAR, filename)
      toast.clear()
    }).catch(e => {
      toast.fail('更换失败')
    })
  },
  // 更新背景图片
  [type.SET_BACKGROUND] ({ commit, state }, payload) {
    const { toast, filename } = payload
    toast.loading({
      loadingType: 'spinner',
      duration: 0,
      message: '请稍后',
      forbidClick: true
    })
    updateBackground({
      phone: state.phone,
      background: filename
    }).then(res => {
      commit(type.SET_BACKGROUND, filename)
      toast.clear()
    }).catch(e => {
      toast.fail('更换失败')
    })
  }
}
