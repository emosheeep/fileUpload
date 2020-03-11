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
    return new Promise((resolve, reject) => {
      findTask({
        creator: state.phone
      }).then(res => {
        commit(type.SET_TASK, res.data)
        resolve(res.data)
      }).catch(e => reject(e))
    })
  },
  // 异步更新联系人信息
  [type.SET_CONTACT] ({ commit, state }, contact) {
    return new Promise((resolve, reject) => {
      updateContact({
        condition: { phone: state.phone },
        data: { contact }
      }).then(result => {
        if (result.status) {
          // 后台数据整体替换
          commit(type.SET_CONTACT, contact)
          resolve(contact)
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(result)
        }
      }).catch(e => reject(e))
    })
  },
  // 更新头像
  [type.SET_AVATAR] ({ commit, state }, filename) {
    return new Promise((resolve, reject) => {
      updateAvatar({
        phone: state.phone,
        avatar: filename
      }).then(res => {
        commit(type.SET_AVATAR, filename)
        resolve(res)
      }).catch(e => reject(e))
    })
  },
  // 更新背景图片
  [type.SET_BACKGROUND] ({ commit, state }, filename) {
    return new Promise((resolve, reject) => {
      updateBackground({
        phone: state.phone,
        background: filename
      }).then(res => {
        commit(type.SET_BACKGROUND, filename)
        resolve(res)
      }).catch(e => reject(e))
    })
  }
}
