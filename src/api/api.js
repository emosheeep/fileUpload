import http from './axios'

// 本地接口
const baseURL = 'http://localhost:3000/api'
const PHONE = `${baseURL}/auth`
const USER = `${baseURL}/user`
const UNIVERSITY = `${baseURL}/university`

// 用户增删改查
export const userEdit = data => http(USER, data, 'POST')
// 发送验证码
export const sendAuthCode = data => http(PHONE, data, 'POST')
// 获取大学信息
export const getUniversity = () => http(UNIVERSITY)
