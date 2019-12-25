// 带过期时间的持久化加密本地存储
import SecureLS from 'secure-ls'

class Storage {
  constructor (maxAge) { // 参数为最长过期时间
    this.storage = new SecureLS()
    this.maxAge = maxAge
  }
  setItem (key, value) {
    try {
      let data = this.storage.get(key)
      data = {
        // 防止时间戳被刷新，失去定时功能
        expires: data ? JSON.parse(data).timeStamp : Date.now() + this.maxAge,
        value: value
      }
      this.storage.set(key, JSON.stringify(data))
    } catch (e) {
      console.log(e.message)
    }
  }
  getItem (key) {
    let {expires, value} = JSON.parse(this.storage.get(key)) // 获取保存数据的时间
    console.log('到期时间:', new Date(expires).toLocaleDateString(), new Date(expires).toLocaleTimeString())
    if (Date.now() > expires) {
      return value
    } else {
      this.removeItem(key)
    }
  }
  removeItem (key) {
    this.storage.remove(key)
  }
}

export default Storage
