import _ from 'lodash'

export default {
  // 判断信息是否完整，即登陆状态
  loginState (state) {
    let values = _.values(state) // 对象属性值
    let result = _.compact(values)
    if (result.length !== values.length) {
      return false
    } else return true
  }
}
