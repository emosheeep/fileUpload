/**
 * 状态对象
 */
export default {
  expires: Date.now() + 7 * 3600 * 24 * 1000, // 过期时间为七天后
  // expires: Date.now() + 24 * 1000, // 过期时间为七天后
  token: '', // 认证信息
  domain: 'http://file.biubiubius.com', // 文件域名
  username: '',
  studentID: '',
  phone: '',
  university: {
    name: '',
    id: ''
  },
  // 联系人小组信息
  contact: [],
  // 发布的任务
  task: [],
  // 待提交清代
  todoList: []
}
