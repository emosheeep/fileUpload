import http from './axios'

const AUTH = '/auth'
const UNIVERSITY = '/university'
const LOGIN = '/login'
const REGISTER = '/register'
const UPDATEPHONE = '/update/phone'
const UPDATEINFO = '/update/info'
const UPDATEAVATAR = '/update/avatar'
const UPDATEBACKGROUND = '/update/background'
const CONTACT = '/update/contact'
const ADDTASK = '/task/add'
const REMOVETASK = '/task/remove'
const UPDATETASK = '/task/update'
const FINDTASK = '/task/find'
const TODOLIST = '/todoList'

// 发送验证码
export const sendAuthCode = data => http(AUTH, data, 'POST')

// 获取大学信息
export const getUniversity = () => http(UNIVERSITY)

// 登陆
export const login = data => http(LOGIN, data, 'POST')

// 注册
export const register = data => http(REGISTER, data, 'POST')

// 修改信息
export const updatePhone = data => http(UPDATEPHONE, data, 'POST')
export const updateInfo = data => http(UPDATEINFO, data, 'POST')
export const updateAvatar = data => http(UPDATEAVATAR, data, 'POST')
export const updateBackground = data => http(UPDATEBACKGROUND, data, 'POST')

// 联系人信息接口
export const updateContact = data => http(CONTACT, data, 'POST')

// 用户的任务信息编辑
export const addTask = data => http(ADDTASK, data, 'POST')
export const removeTask = data => http(REMOVETASK, data, 'POST')
export const updateTask = data => http(UPDATETASK, data, 'POST')
export const findTask = data => http(FINDTASK, data, 'POST')

// 查询待提交清单
export const todoList = data => http(TODOLIST, data, 'POST')
