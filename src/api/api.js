import http from './axios'

// 本地接口
const baseURL = 'http://localhost:3001/api'
// 网络接口
// const baseURL = 'http://www.biubiubius.com:3001/api'

const AUTH = `${baseURL}/auth`
const UNIVERSITY = `${baseURL}/university`
const LOGIN = `${baseURL}/login`
const REGISTER = `${baseURL}/register`
const UPDATE = `${baseURL}/update`
const LOGOUT = `${baseURL}/logout`
const CONTACT = `${baseURL}/update/contact`
const TASK = `${baseURL}/task`

// 发送验证码
export const sendAuthCode = data => http(AUTH, data, 'POST')
// 获取大学信息
export const getUniversity = () => http(UNIVERSITY)
// 登陆
export const login = data => http(LOGIN, data, 'POST')
// 登出
export const logout = () => http(LOGOUT)
// 注册
export const register = data => http(REGISTER, data, 'POST')
// 修改信息
export const update = data => http(UPDATE, data, 'POST')
// 联系人信息接口
export const updateContact = data => http(CONTACT, data, 'POST')
// 添加用户的任务信息
export const addTask = data => http(TASK, data, 'POST')
