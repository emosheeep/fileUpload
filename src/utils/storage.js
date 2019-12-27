// 带过期时间的持久化加密本地存储
import SecureLS from 'secure-ls'

class Storage {
  constructor () { // 参数为最长过期时间
    this.storage = new SecureLS()
  }
  setItem (key, value) {
    // 这里的value已经是JSON格式
    this.storage.set(key, value)
  }
  getItem (key) {
    let data = JSON.parse(this.storage.get(key))
    console.log('到期时间：', new Date(data.expires).toLocaleDateString(), new Date(data.expires).toLocaleTimeString())
    if (Date.now() <= data.expires) {
      return this.storage.get(key)
    } else {
      // 时间过期就清空
      this.removeItem(key)
      return {}
    }
  }
  removeItem (key) {
    this.storage.remove(key)
  }
}

export default Storage
