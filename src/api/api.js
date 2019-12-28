import http from './axios'
import store from '../store'

const AUTH = '/auth'
const UNIVERSITY = '/university'
const LOGIN = '/login'
const REGISTER = '/register'
const UPDATEPHONE = '/update/phone'
const UPDATEINFO = '/update/info'
const CONTACT = '/update/contact'
const ADDTASK = '/task/add'
const REMOVETASK = '/task/remove'
const UPDATETASK = '/task/update'
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
export const updatePhone = data => http(UPDATEPHONE, data, 'POST', {authorization: store.state.token})
export const updateInfo = data => http(UPDATEINFO, data, 'POST', {authorization: store.state.token})
// 联系人信息接口
export const updateContact = data => http(CONTACT, data, 'POST', {authorization: store.state.token})
// 用户的任务信息编辑
export const addTask = data => http(ADDTASK, data, 'POST', {authorization: store.state.token})
export const removeTask = data => http(REMOVETASK, data, 'POST', {authorization: store.state.token})
export const updateTask = data => http(UPDATETASK, data, 'POST', {authorization: store.state.token})
// 查询待提交清单
export const todoList = data => http(TODOLIST, data, 'POST', {authorization: store.state.token})
