/**
 * 通过mutations间接更新state，这里的方法可以是异步的
 */
import {
  findTask
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
  }
}
