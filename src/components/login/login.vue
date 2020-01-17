<template>
  <div>
    <van-field v-model="phone"
               type="tel"
               label="手机号"
               maxlength="11"
               placeholder="请输入手机号"
               clearable
               required
               @blur="judgeMobile"
               :error-message="telErrMsg"/>
    <van-field v-model="studentID"
               label="学号"
               clearable
               placeholder="请输入学号"/>
    <van-button plain size="large"
                :loading="loading"
                @click="login">登陆</van-button>
  </div>
</template>

<script>
import { Field } from 'vant'
import { login } from '../../api/api'
import type from '../../store/mutation-types'
export default {
  name: 'login',
  components: {
    'van-field': Field
  },
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
    login () {
      if (!this.checkState()) {
        return this.$toast('请填写正确信息')
      }
      this.loading = true
      login({
        phone: this.phone,
        studentID: this.studentID
      }).then(result => {
        result.msg && this.$toast(result.msg)
        this.$store.commit(type.UPDATE_USER, result.user)
        this.$router.push({ name: 'home' }, () => {
          console.log('登陆成功')
        }, e => e) // 跳转到主页
      }).catch(e => {
        if (e.data) {
          this.$toast(e.data.msg)
        } else {
          console.error(e.message)
          this.$toast('系统错误')
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
