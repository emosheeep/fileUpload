/**
 * 定义一些常量
 */
let methods = {
  UPDATE_USER: 'UPDATE_USER', // 更新用户信息
  CLEAR_USER: 'CLEAR_USER', // 清除用户信息
  SET_CONTACT: 'SET_CONTACT', // 设置联系人分组
  ADD_TASK: 'ADD_TASK', // 新增任务
  SET_TASK: 'SET_TASK', // 新增任务
  DELETE_TASK: 'DELETE_TASK', // 删除任务
  UPDATE_TASK: 'UPDATE_TASK', // 更新任务
  FIND_TASK: 'FIND_TASK', // 查询任务
  SET_TODOLIST: 'SET_TODOLIST', // 设置待提交清单
  SET_TOKEN: 'SET_TOKEN', // 设置令牌
  SET_USER_BY_PHONE: 'SET_USER_BY_PHONE', // 服务器端更新数据后，本地也需要更新
  SET_AVATAR: 'SET_AVATAR' // 修改头像
}
Object.freeze(methods)
export default methods
