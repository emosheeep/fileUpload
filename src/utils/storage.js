// 带过期时间的持久化加密本地存储
import SecureLS from 'secure-ls'
const maxAge = (60 * 1000 * 60 * 24) * 10 // 过期时间为十天

class Storage {
  constructor () {
    this.storage = new SecureLS({encodingType: 'aes'})
  }
  setItem (key, value) {
    let data = {
      timeStamp: Date.now(),
      value: value
    }
    this.storage.set(key, JSON.stringify(data))
  }
  getItem (key) {
    let data = JSON.parse(this.storage.get(key))
    let timeStamp = data.timeStamp // 获取保存数据的时间
    let time = Date.now() - timeStamp // 计算时间差
    if (time < maxAge) {
      return data.value
    } else {
      this.storage.remove(key)
    }
  }
  removeItem (key) {
    this.storage.remove(key)
  }
}

export default Storage
