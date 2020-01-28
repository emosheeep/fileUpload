/**
 * 状态对象
 */
export default {
  expires: '', // 过期时间为七天后
  token: '', // 认证信息
  domain: '', // CDN域名
  username: '',
  studentID: '',
  phone: '',
  avatar: '', // 头像路径
  background: '', // 背景图片路径
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
