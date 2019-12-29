import upyun from 'upyun'
import http from './axios'
import {Base64} from 'js-base64'

function getHeaderSign (bucket, method, path) {
  return http('/sign/upyun', {
    bucket: bucket.bucketName,
    method,
    path
  })
}

let bucket = new upyun.Bucket('image-fileupload')

// 又拍云压缩
const UPYUN_COMPRESS = 'http://p0.api.upyun.com/pretreatment/'

// 通用
export const client = new upyun.Client(bucket, getHeaderSign)
// 又拍云cdn缓存刷新
export const refreshCDN = url => http('/sign/refresh', { url }, 'POST')
// 压缩云端文件
export const compress = async (tasks) => {
  return new Promise((resolve, reject) => {
    http('/sign/compress', {}, 'POST').then(headers => {
      let data = {
        notify_url: 'https://hooks.upyun.com/OVYZW1X4_',
        tasks: Base64.encode(JSON.stringify(tasks)),
        service: 'image-fileupload',
        app_name: 'compress'
      }
      resolve(http(UPYUN_COMPRESS, data, 'POST', headers))
    }).catch(e => reject(e))
  })
}
