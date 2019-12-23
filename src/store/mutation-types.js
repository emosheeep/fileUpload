/**
 * 定义一些常量
 */
let methods = {
  UPDATE_USER: 'UPDATE_USER', // 更新用户信息
  CLEAR_USER: 'CLEAR_USER', // 清除用户信息
  SET_CONTACT: 'SET_CONTACT', // 设置联系人分组
  SET_TASK: 'SET_TASK', // 设置任务
  SET_TODOLIST: 'SET_TODOLIST', // 设置待提交清单
  SET_TOKEN: 'SET_TOKEN', // 设置令牌
  SET_USER_BY_PHONE: 'SET_USER_BY_PHONE' // 服务器端更新数据后，本地也需要更新
}
Object.freeze(methods)
export default methods
