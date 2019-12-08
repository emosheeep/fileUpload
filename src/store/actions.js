/**
 * 通过mutations间接更新state，这里的方法可以是异步的
 */
import {
  getUniversity
} from '../api/api.js'
import type from './mutation-types'

export default {
  // 获取大学信息
  [type.SET_UNIVERSITY] ({commit}) {
    getUniversity().then(data => {
      commit(type.SET_UNIVERSITY, data)
    })
  }
}
