<template>
    <div>
      <van-cell-group>
        <van-field
          v-model="username"
          label="姓名"
          placeholder="请输入姓名" />
        <van-field
          readonly
          clickable
          label="学校"
          :value="university.name"
          placeholder="选择学校"
          @click="chooseSchool"/>
<!--        选择学校-->
        <van-popup
          v-model="schoolPickerShow"
          :lazy-render="false"
          position="bottom"
          :duration="0.5"
          style="height: 100%">
          <school-picker
            ref="university"
            :show.sync="schoolPickerShow"
            :school.sync="university"/>
        </van-popup>
<!--        学校选择结束-->
        <van-field v-model="studentID"  label="学号"  placeholder="请输入学号"/>
<!--        作用域插槽-->
        <slot v-bind:user="{
          username: username,
          studentID: studentID,
          university: university
        }">
          <phone submitText="注册" :loading="loading"
                 ref="phone"
                 @submit="register" />
        </slot>
      </van-cell-group>
    </div>
</template>

<script>
import { CellGroup, Field, Popup } from 'vant'
import _ from 'lodash'
import { register } from '../../api/api'
import SchoolPicker from './schoolPicker'
export default {
  name: 'register',
  components: {
    'van-cell-group': CellGroup,
    'van-field': Field,
    'van-popup': Popup,
    'phone': () => import('./phone'),
    SchoolPicker
  },
  data () {
    return {
      loading: false, // 按钮加载状态
      isBanned: false, // 验证码按钮状态
      btnText: '发送验证码', // 按钮文字
      smsCode: '', // 短信验证码
      schoolPickerShow: false, // 控制变量
      university: {
        name: '',
        id: ''
      }, // 学校
      username: '', // 用户姓名
      studentID: '', // 学号
      phone: '', // 电话号码
      telErrMsg: '' // 手机号格式错误提示消息
    }
  },
  watch: {
    // 监听user属性，给组件内数据初始化
    user (newVal) {
      console.log(newVal)
      if (newVal) {
        this.username = newVal.username // 用户姓名
        this.studentID = newVal.studentID// studentID: '', // 学号
        this.phone = newVal.phone // 电话号码
        this.university = newVal.university // 大学信息
      }
    }
  },
  methods: {
    chooseSchool () {
      this.schoolPickerShow = true
      this.$refs.university.searchText = this.university.name
    },
    // 检查数据完整性，不完整返回false
    checkState () {
      // 利用lodash排除空值
      let result = _.compact([
        this.university.name,
        this.username,
        this.phone,
        this.studentID,
        this.smsCode
      ])
      if (result.length < 5) {
        return false
      } else return true
    },
    register (data) {
      // 将子组件传来的值
      this.phone = data.phone
      this.smsCode = data.smsCode
      if (!this.checkState()) {
        return this.$toast('请填写完整信息')
      }
      this.loading = true
      // 用户注册
      register({
        username: this.username,
        studentID: this.studentID,
        phone: this.phone,
        university: this.university,
        smsCode: this.smsCode // 验证码
      }).then(data => {
        data.msg && this.$toast(data.msg)
        this.$refs.phone.clear() // 清除电话号码
      }).catch(e => {
        if (e.data) {
          this.$toast(e.data.msg)
        } else {
          this.$toast('系统错误')
        }
      }).finally(() => {
        this.loading = false // 停止加载
      })
    },
    // 根据场景设置表单值
    setUserInfo (data) {
      this.studentID = data.studentID
      this.username = data.username
      this.university = data.university
      this.phone = data.phone
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
