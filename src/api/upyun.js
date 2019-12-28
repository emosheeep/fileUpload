import upyun from 'upyun'
import http from './axios'

function getHeaderSign (bucket, method, path) {
  let params = 'bucket=' + bucket.bucketName + '&method=' + method + '&path=' + path
  return http('/sign/upyun?' + params)
}

let bucket = new upyun.Bucket('image-fileupload')

// 通用
export const client = new upyun.Client(bucket, getHeaderSign)
// 压缩云端文件
export const compress = tasks => http('/sign/compress', { tasks }, 'POST')
// 又拍云cdn缓存刷新
export const refreshCDN = url => http('/sign/refresh', { url }, 'POST')
