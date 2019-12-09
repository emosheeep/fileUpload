<template>
    <div>
      <van-nav-bar left-text="返回"  left-arrow  @click-left="onClickLeft"/>
      <van-cell-group>
        <van-field v-model="username"  label="用户名"  placeholder="请输入姓名" required/>
        <van-field readonly clickable label="学校" :value="school.name"
                   placeholder="选择学校" @click="showPicker" required/>
        <van-field v-model="studentID"  label="学号"  placeholder="请输入学号" required/>
        <van-popup v-model="show" :lazy-render="false" position="bottom"
                   :duration="0.5" style="height: 100%">
          <van-sticky>
            <form action="/"><van-search
              v-model="searchText"
              placeholder="请输入学校关键词"
              show-action
              shape="round"
              @input="onSearch"
              @cancel="show = false"/>
            </form>
          </van-sticky>
          <van-cell title="暂无记录" v-if="searchResult.length === 0" />
          <van-cell-group @click="chooseSchool" :border="false">
            <van-cell v-for="(item, index) in searchResult" :key="index"
                      :title="item" />
          </van-cell-group>
        </van-popup>
        <van-field v-model="mobile" type="tel" label="手机号" required
                   placeholder="请输入手机号"
                   maxlength="11"
                   @blur="judgeMobile"
                   :error-message="telErrMsg"/>
        <van-field v-model="smsCode" type="number" label="验证码" center clearable
                   placeholder="请输入短信验证码">
          <van-button slot="button" size="small" type="primary"
                      :disabled="isBanned"
                      @click="sendCode">{{btnText}}</van-button>
        </van-field>
        <van-button size="large" @click="register">注册</van-button>
      </van-cell-group>
    </div>
</template>

<script>
import _ from 'lodash'
import Cookies from 'js-cookie'
import {sendAuthCode, getUniversity, userEdit} from '../api/api'
export default {
  name: 'login',
  data () {
    return {
      isBanned: false, // 验证码按钮状态
      btnText: '发送验证码', // 按钮文字
      smsCode: '', // 短信验证码
      show: false, // 控制变量
      school: {
        name: '',
        id: ''
      }, // 学校
      schoolID: '', // 学校id
      username: '', // 用户姓名
      studentID: '', // 学号
      mobile: '', // 电话号码
      universities: {}, // 大学信息
      uniName: [], // 大学名称集合，用来搜索
      searchText: '', // 搜索框的文本
      searchResult: [], // 搜索结果
      telErrMsg: '' // 手机号格式错误提示消息
    }
  },
  methods: {
    showPicker () {
      this.show = true
      this.searchText = this.school.name
    },
    onClickLeft () {},
    // 模糊搜索，并返回结果数组，lodash节流
    onSearch: _.throttle(function (value) {
      if (!value) {
        this.searchResult = []
        return
      }
      this.searchResult = _.filter(this.uniName, (item) => {
        if (item.indexOf(value) !== -1) {
          return true
        }
      })
    }, 200),
    // 选择学校
    chooseSchool (event) {
      let name = event.target.innerText
      if (!name) {
        return
      }
      this.school = {
        id: this.universities[name],
        name: name
      }
      this.show = false
    },
    judgeMobile () {
      if (this.mobile.length < 11) {
        this.telErrMsg = '手机号格式错误'
      } else {
        this.telErrMsg = ''
      }
    },
    // 返回值为true代表当前手机号还在冷却阶段，不能发验证码
    phoneCookie () {
      let curPhone = Cookies.get('curPhone')
      if (curPhone === this.mobile) {
        return true
      } else return false
    },
    // 按钮倒计时
    delay (time) {
      // 利用cookie限制用户短信验证码的频率
      Cookies.set('curPhone', this.mobile, {
        expires: new Date(new Date().getTime() + 1000 * time)
      })
      console.log('设置cookie')
      this.isBanned = true
      this.btnText = `${time}秒后重发`
      // 计时器
      let timeId = setInterval(() => {
        time -= 1
        this.btnText = `${time}秒后重发`
        if (time === 0) {
          this.isBanned = false
          this.btnText = '发送验证码'
          clearInterval(timeId)
          this.isBanned = false
        }
      }, 1000)
    },
    // 检查数据完整性，不完整返回false
    checkState () {
      // 利用lodash排除空值
      let result = _.compact([
        this.school.name,
        this.username,
        this.mobile,
        this.studentID,
        this.smsCode
      ])
      if (result.length < 5) {
        return false
      } else return true
    },
    // 注册
    register () {
      if (!this.checkState()) {
        return this.$toast('请填写完整信息')
      }
      // 用户注册参数
      let options = {
        type: 'insert',
        data: {
          name: this.username,
          studentID: this.studentID,
          phone: this.mobile,
          university: this.school
        }
      }
      this.judgeCode().then(data => {
        if (!data.status) {
          this.$toast('验证码错误')
        } else {
          // 验证码正确则查询用户是否存在
          userEdit({
            type: 'find',
            condition: {
              phone: this.mobile
            }
          }).then(data => {
            if (data.length !== 0) {
              this.$toast.fail('用户已存在')
            } else {
              // 用户不存在，注册
              userEdit(options).then(data => {
                this.$toast('注册成功')
                console.log(data)
              }).catch(err => {
                this.$toast.fail('系统错误')
                console.error(err)
              })
            }
          }).catch(err => { console.error(err) })
        }
      }).catch((err) => { console.error(err) })
    },
    // 发送验证码
    sendCode () {
      if (this.mobile.length !== 11) {
        this.$toast('请输入正确的手机号')
      } else if (this.phoneCookie()) {
        this.$toast('请稍后再试')
      } else {
        let data = {
          type: 'send',
          options: {
            mobile: this.mobile
          }
        }
        this.delay(60) // 60s延迟，以及设置cookie过期时间
        sendAuthCode(data).then(data => {
          console.log(data)
          if (data.code === 0) {
            this.$toast.success('发送成功')
          } else {
            this.$toast.fail('发送失败')
          }
        }).catch(err => {
          console.error(err)
          this.$toast.fail('发送失败')
        })
      }
    },
    // 验证码校验
    judgeCode () {
      let options = {
        type: 'auth',
        options: {
          mobile: this.mobile,
          code: this.smsCode
        }
      }
      return new Promise((resolve, reject) => {
        sendAuthCode(options).then(data => {
          if (data.status) {
            resolve({
              status: true,
              msg: '验证成功'
            })
          } else {
            resolve({
              status: false,
              msg: '验证码错误'
            })
          }
        }).catch(err => { reject(err) })
      })
    }
  },
  mounted () {
    // 获取大学信息
    getUniversity().then(data => {
      this.universities = data
      this.uniName = Object.keys(data)
    }).catch(err => { console.log(err) })
  }
}
</script>

<style scoped lang="stylus">
</style>
