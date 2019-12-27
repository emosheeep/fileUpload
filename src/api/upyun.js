import upyun from 'upyun'
import http from './axios'

function getHeaderSign (bucket, method, path) {
  let params = 'bucket=' + bucket.bucketName + '&method=' + method + '&path=' + path
  return http('http://localhost:3001/api/sign/upyun?' + params)
}

let bucket = new upyun.Bucket('image-fileupload')
let client = new upyun.Client(bucket, getHeaderSign)
export default client
