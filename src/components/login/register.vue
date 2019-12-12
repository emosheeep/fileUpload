<template>
    <div>
      <van-cell-group>
        <van-field
          v-model="username"
          label="用户名"
          placeholder="请输入姓名" />
        <van-field
          readonly
          clickable
          label="学校"
          :value="university.name"
          placeholder="选择学校"
          @click="showPicker"/>
<!--        选择学校-->
        <van-popup
          v-model="show"
          :lazy-render="false"
          position="bottom"
          :duration="0.5"
          style="height: 100%">
          <van-sticky>
            <form action="/"><van-search
              v-model="searchText"
              placeholder="请输入学校关键词"
              show-action
              autofocus
              shape="round"
              @search="onSearch"
              @input="onSearch"
              @cancel="show = false"/>
            </form>
          </van-sticky>
          <van-list
            :finished="true"
            @click.native="chooseSchool"
            finished-text="没有更多了">
            <van-cell v-for="(item, index) in searchResult" :key="index"
                      :title="item" />
          </van-list>
        </van-popup>
<!--        学校选择结束-->
        <van-field v-model="studentID"  label="学号"  placeholder="请输入学号"/>
<!--        作用域插槽-->
        <slot v-bind:user="{
          username: username,
          studentID: studentID,
          university: university
        }">
          <phone submitText="注册" :loading="loading" @submit="register"></phone>
        </slot>
      </van-cell-group>
    </div>
</template>

<script>
import _ from 'lodash'
import {getUniversity, register} from '../../api/api'
export default {
  name: 'register',
  props: {
    updateShow: Boolean
  },
  data () {
    return {
      loading: false, // 按钮加载状态
      isBanned: false, // 验证码按钮状态
      btnText: '发送验证码', // 按钮文字
      smsCode: '', // 短信验证码
      show: false, // 控制变量
      university: {
        name: '',
        id: ''
      }, // 学校
      username: '', // 用户姓名
      studentID: '', // 学号
      phone: '', // 电话号码
      schools: {}, // 大学信息
      uniName: [], // 大学名称集合，用来搜索
      searchText: '', // 搜索框的文本
      searchResult: [], // 搜索结果
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
  components: { 'phone': () => import('./phone') },
  methods: {
    showPicker () {
      this.show = true
      this.searchText = this.university.name
    },
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
      console.log(name)
      if (!name) {
        return
      }
      this.university = {
        id: this.schools[name],
        name: name
      }
      this.show = false
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
    async register (data) {
      // 将子组件传来的值
      this.phone = data.phone
      this.smsCode = data.smsCode
      if (!this.checkState()) {
        return this.$toast('请填写完整信息')
      }
      try {
        this.loading = true
        // 用户注册
        let data = await register({
          username: this.username,
          studentID: this.studentID,
          phone: this.phone,
          university: this.university,
          code: this.smsCode // 验证码
        })
        this.$toast(data.msg)
      } catch (e) {
        console.error(e.message)
        this.$toast('系统错误')
      } finally {
        this.loading = false // 停止加载
      }
    },
    // 获取大学信息
    getUniInfo () {
      getUniversity().then(data => {
        this.schools = data
        this.uniName = Object.keys(data)
      }).catch(() => {
        this.getUniInfo() // 连续请求直到成功
      })
    },
    // 根据场景设置表单值
    setUserInfo (data) {
      this.studentID = data.studentID
      this.username = data.username
      this.university = data.university
      this.phone = data.phone
    }
  },
  mounted () {
    // 获取大学信息
    this.getUniInfo()
  }
}
</script>

<style scoped lang="stylus">
</style>
