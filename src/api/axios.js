/*
ajax请求函数模块
返回promise对象,返回数据response.data
 */
import axios from 'axios'
import Qs from 'qs'
import store from '../store'

// 本地接口
axios.defaults.baseURL = 'http://localhost:3001/api'
// 网络接口
// axios.defaults.baseURL = 'http://www.biubiubius.com:3001/api'

export default function (url, data = {}, type = 'GET',
  headers = {authorization: store.state.token}) {
  return new Promise((resolve, reject) => {
    // 保存由axios返回的promise对象
    let promise
    if (type === 'GET') {
      promise = axios.get(url, {
        params: data,
        headers
      })
    } else {
      // 发送post请求 序列化为表单数据
      promise = axios.post(url, Qs.stringify(data), { headers })
    }

    promise.then(res => {
      // 成功调用resolve,返回数据部分
      resolve(res.data)
    }).catch(err => {
      if (err) {
        reject(err.response)
      } else {
        console.log(err)
        reject(err)
      }
    })
  })
}
