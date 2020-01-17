<template>
    <div>
      <van-field v-model="phone" type="tel" label="手机号" required
                 placeholder="请输入手机号" clearable
                 right-icon="question-o"
                 @click-right-icon="$toast('手机号作为账号用于登录')"
                 maxlength="11"
                 @blur="judgeMobile"
                 :error-message="telErrMsg"/>
      <van-field v-model="smsCode" type="number" maxlength="6" label="验证码"
                 center clearable
                 placeholder="请输入验证码">
        <van-button slot="button" size="small" type="info"
                    :disabled="isBanned"
                    @click="sendCode">{{btnText}}</van-button>
      </van-field>
      <van-button plain size="large" :loading="loading"
                  @click="submit">{{submitText}}</van-button>
    </div>
</template>

<script>
import { Field } from 'vant'
import { sendAuthCode } from '../../api/api'
export default {
  name: 'phone',
  components: {
    'van-field': Field
  },
  props: {
    submitText: String,
    loading: Boolean // 控制按钮加载状态
  },
  data () {
    return {
      telErrMsg: '', // 错误提示消息
      isBanned: false, // 验证码按钮状态
      btnText: '发送验证码', // 按钮文字
      smsCode: '', // 短信验证码
      phone: '', // 电话
      phoneDefault: '' // 默认电话，如果phone和这个相等说明电话没有改变，不触发请求
    }
  },
  methods: {
    // 判断手机号格式
    judgeMobile () {
      if (this.phone.length < 11) {
        this.telErrMsg = '手机号格式错误'
      } else {
        this.telErrMsg = ''
      }
    },
    async sendCode () {
      if (this.phone.length !== 11) {
        return this.$toast('请输入正确的手机号')
      } else if (this.phoneDefault === this.phone) {
        return this.$toast('手机号没有变化')
      } else if (this.phoneCookie()) { // 检查cookie
        return this.$toast('请稍后再试')
      }
      this.delay(60) // 60s倒计时，并用cookie限制60s内不能发送相同手机号的验证码
      try {
        // 发送验证码
        let data = await sendAuthCode({ phone: this.phone })
        this.$toast(data.msg)
        console.log(data)
      } catch (e) {
        console.error(e)
        this.$toast.fail('系统错误')
      }
    },
    // 按钮倒计时
    delay (time) {
      // 利用cookie限制用户短信验证码的频率
      this.$cookie.set('curPhone', this.phone, {
        expires: new Date(new Date().getTime() + 1000 * time)
      })
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
    // 返回值为true代表当前手机号还在冷却阶段，不能发验证码
    phoneCookie () {
      let curPhone = this.$cookie.get('curPhone')
      if (curPhone === this.phone) {
        return true
      } else return false
    },
    // 设置默认手机号
    setDefaultPhone (number) {
      this.phoneDefault = number
    },
    // 清空状态
    clear () {
      this.phone = ''
      this.smsCode = ''
    },
    // 触发父组件事件并传入数据
    submit () {
      this.$emit('submit', {
        phone: this.phone,
        smsCode: this.smsCode
      })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
