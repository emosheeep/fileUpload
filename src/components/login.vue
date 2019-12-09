<template>
    <div>
      <van-nav-bar  left-text="返回"  left-arrow  @click-left="onClickLeft"/>
      <van-field v-model="username"  label="用户名"  placeholder="请输入姓名"/>
      <van-field readonly clickable label="学校" :value="school"
        placeholder="选择学校" @click="showPicker = true" />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker show-toolbar :columns="columns"
                    @cancel="showPicker = false"
                    @confirm="onConfirm"/>
      </van-popup>
      <van-field v-model="mobile" type="tel" label="手机号" placeholder="请输入手机号"
                 error-message="手机号格式错误"/>
      <van-field v-model="smsCode" type="number" center clearable label="短信验证码" placeholder="请输入短信验证码">
        <van-button slot="button" size="small" type="primary"
                    @click="sendCode">发送验证码</van-button>
      </van-field>
      <van-button @click="isCodePassed">注册</van-button>
    </div>
</template>

<script>
import _ from 'lodash'
import {sendAuthCode, getUniversity} from '../api/api'
export default {
  name: 'login',
  data () {
    return {
      smsCode: '',
      showPicker: false,
      school: '',
      username: '',
      mobile: '',
      provinces: [],
      cities: [],
      universities: []
    }
  },
  computed: {
    columns () {
      return [
        {
          values: this.provinces,
          className: 'province'
        },
        {
          values: this.universities.map((item) => {
            return item.name
          }),
          className: 'school'
        }
      ]
    }
  },
  methods: {
    onClickLeft () {},
    onConfirm () {},
    // 发送验证码
    sendCode () {
      let data = {
        type: 'send',
        options: {
          mobile: this.mobile
        }
      }
      sendAuthCode(data).then(data => {
        console.log(data)
      }).catch(err => { console.error(err) })
    },
    // 验证码校验
    isCodePassed () {
      let options = {
        type: 'auth',
        options: {
          mobile: this.mobile,
          code: this.smsCode
        }
      }
      sendAuthCode(options).then(data => {
        if (data.status) {
          console.log('验证成功')
        } else {
          console.log('验证码错误')
        }
      }).catch(err => { console.log(err) })
    }
  },
  mounted () {
    getUniversity().then(data => {
      let university = data
      this.provinces = Object.keys(university.province)
      this.cities = Object.keys(university.school)
      this.universities = _.reduce(university.school, (result, item) => {
        return result.concat(item)
      }, [])
    }).catch(err => { console.log(err) })
  }
}
</script>

<style scoped lang="stylus">
  .school
    width 45%
</style>
