import upyun from 'upyun'

function getHeaderSign (bucket, method, path) {
  let params = 'bucket=' + bucket.bucketName + '&method=' + method + '&path=' + path
  return fetch('http://localhost:3001/api/sign/upyun?' + params)
    .then(function (response) {
      if (response.status !== 200) {
        console.error('gen header sign faild!')
        return
      }
      return response.json()
    })
}

let bucket = new upyun.Bucket('image-fileupload')
let client = new upyun.Client(bucket, getHeaderSign)
export default client
