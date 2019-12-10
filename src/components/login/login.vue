<template>
  <div>
    <van-field v-model="phone" type="tel" label="手机号" required
               placeholder="请输入手机号"
               maxlength="11"
               @blur="judgeMobile"
               :error-message="telErrMsg"/>
    <van-field v-model="studentID"  label="学号"  placeholder="请输入学号" required/>
    <van-button plain :loading="loading" @click="login">登陆</van-button>
  </div>
</template>

<script>
import {login} from '../../api/api.js'
export default {
  name: 'login',
  data () {
    return {
      phone: '',
      studentID: '',
      telErrMsg: '',
      loading: false
    }
  },
  methods: {
    judgeMobile () {
      if (this.phone.length < 11) {
        this.telErrMsg = '手机号格式错误'
      } else {
        this.telErrMsg = ''
      }
    },
    checkState () {
      if (this.phone === '' || this.telErrMsg !== '' || this.studentID === '') {
        return false
      } else return true
    },
    async login () {
      if (!this.checkState()) {
        return this.$toast('请填写正确信息')
      }
      let options = {
        phone: this.phone,
        studentID: this.studentID
      }
      try {
        this.loading = true
        let result = await login(options)
        if (!result.status) { // 登陆失败
          this.$toast(result.msg)
          this.loading = false
        } else { // 登陆成功
          result.msg && this.$toast(result.msg)
          this.loading = false
          this.$router.push({path: '/'}) // 跳转到主页
        }
      } catch (e) {
        console.error(e.message)
        this.$toast('系统错误')
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
