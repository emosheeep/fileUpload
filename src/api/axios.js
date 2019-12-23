/*
ajax请求函数模块
返回promise对象,返回数据response.data
 */
import store from '../store'
import axios from 'axios'
import Qs from 'qs'

export default function (url, data = {}, type = 'GET') {
  return new Promise(function (resolve, reject) {
    // 保存由axios返回的promise对象
    let promise = null
    if (type === 'GET') {
      // 准备url query数据
      let dataStr = '' // 数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += (key + '=' + data[key] + '&')
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = `${url}?${dataStr}`
      }
      promise = axios.get(url)
    } else {
      // 发送post请求 序列化为表单数据
      promise = axios.post(url, Qs.stringify(data))
    }

    promise.then(function (result) {
      // 成功调用resolve
      resolve(result.data)
    }).catch((err) => {
      // 失败了调用reject
      reject(err)
    })
  })
}
// axios 请求拦截，添加token认证信息
axios.interceptors.request.use((req) => {
  // 在 headers 中设置authorization 属性放token
  console.log(store.state.token)
  req.headers.authorization = store.state.token
  console.log(req.headers)

  return req
}, (e) => Promise.reject(e))
