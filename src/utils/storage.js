// 带过期时间的持久化加密本地存储
import { Base64 } from 'js-base64'

class Storage {
  constructor () { // 参数为最长过期时间
    this.storage = window.localStorage
  }
  setItem (key, value) {
    // 这里的value已经是JSON格式
    this.storage.setItem(key, Base64.encode(value))
  }
  getItem (key) {
    let origin = Base64.decode(this.storage.getItem(key))
    let { expires } = JSON.parse((origin))
    console.log('到期时间：', new Date(expires).toLocaleDateString(), new Date(expires).toLocaleTimeString())
    if (Date.now() <= expires) {
      return origin // 这里要返回JSON格式字符串
    } else {
      // 时间过期就清空
      this.removeItem(key)
      return ''
    }
  }
  removeItem (key) {
    this.storage.removeItem(key)
  }
}

export default Storage
