<template>
    <div>
      <van-nav-bar title="我的主页" right-text="按钮"/>
      <div class="header" @click="isLogin">
        <div class="avatar">
          <van-image round width="6rem" height="6rem" cover
                     src="https://img.yzcdn.cn/vant/cat.jpeg"/>
        </div>
        <div class="info">
          <div v-if="loginState">
            <p>{{username}}</p>
            <p>{{university.name}}</p>
          </div>
          <div v-else>
            <h3>请先登录</h3>
          </div>
        </div>
        <div class="right">
          <van-icon name="arrow"></van-icon>
        </div>
      </div>
      <van-popup v-model="showInfo" position="right" style="width: 100%; height: 100%">
        <van-nav-bar title="个人信息" left-text="返回" left-arrow
                     @click-left="showInfo = false"/>
<!--        手机号-->
        <van-cell-group title="账号信息" :border="false">
          <van-cell title="更换手机号" :value="phone" is-link
                     @click="showPhoneChange"></van-cell>
          <van-popup v-model="changePhoneShow" position="right" :lazy-render="false"
                     style="width: 100%; height: 100%">
            <van-nav-bar title="修改信息" left-text="返回" left-arrow
                         @click-left="changePhoneShow = false"/>
            <phone submitText="确认" :loading="loading"
                   @submit="updatePhone" ref="updatePhone"></phone>
          </van-popup>
        </van-cell-group>
<!--        基础信息-->
        <van-cell-group title="基本信息" :border="false">
          <van-cell title="姓名" :value="username"></van-cell>
          <van-cell title="学号" :value="studentID"></van-cell>
          <van-cell title="学校" :value="university.name"></van-cell>
        </van-cell-group>
        <van-divider />
<!--        修改基础信息-->
        <van-cell-group title="操作" :border="false">
          <van-cell title="修改资料" is-link @click="showUpdate"></van-cell>
          <van-popup v-model="updateShow" position="right" :lazy-render="false"
                     style="width: 100%; height: 100%">
            <van-nav-bar title="修改信息" left-text="返回" left-arrow
                         @click-left="updateShow = false"/>
            <register :updateShow.sync="updateShow" ref="updateInfo">
              <template v-slot:default="userInfo">
                <van-button size="large" :loading="loading"
                            @click="updateInfo(userInfo.user)">确认修改</van-button>
              </template>
            </register>
          </van-popup>
          <van-cell title="退出登录" is-link></van-cell>
        </van-cell-group>
      </van-popup>
      <van-divider style="margin: 1px 0"/>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import _ from 'lodash'
import {update} from '../../api/api'
import type from '../../store/mutation-types'
import register from '../login/register'
export default {
  name: 'home',
  data () {
    return {
      showInfo: false, // 控制资料选项卡
      updateShow: false, // 修改资料选项卡
      changePhoneShow: false, // 修改手机号
      loading: false
    }
  },
  computed: {
    ...mapState({
      username: 'username',
      studentID: 'studentID',
      phone: 'phone',
      university: 'university',
      loginState: 'loginState'
    })
  },
  methods: {
    // 进入修改资料面板并变更数据
    showUpdate () {
      this.updateShow = true
      this.$refs.updateInfo.setUserInfo(this.$store.getters.userInfo)
    },
    // 进入手机号绑定界面并设置数据
    showPhoneChange () {
      this.changePhoneShow = true
      this.$refs.updatePhone.setDefaultPhone(this.phone)
    },
    isLogin () {
      // 获取本地登陆状态
      if (!this.$cookie.get('loginUser')) {
        return this.$router.push({name: 'login'})
      }
      this.showInfo = true
    },
    // 修改基本信息 不包括账号（电话号码）
    async updateInfo (userInfo) {
      let localUserInfo = this.$store.getters.userInfo
      delete localUserInfo.phone // 排除电话号码
      // 判断除电话号码外其他值是否相等
      let equal = _.isEqual(localUserInfo, userInfo)
      if (equal) {
        return this.$toast('信息没有变化')
      }
      let optionUpdate = {
        type: 'update',
        condition: { phone: this.phone },
        data: userInfo
      }
      try {
        this.loading = true
        let result = await update(optionUpdate)
        this.$toast(result.msg)
        if (result.status) {
          // result 为修改成功后的用户数据
          this.$store.commit(type.UPDATE_USER, result.data)
          this.updateShow = false
        }
        console.log(result)
      } catch (e) {
        console.error(e)
        this.$toast.fail('系统错误')
      } finally {
        this.loading = false
      }
    },
    // 更换手机号码
    async updatePhone (data) {
      let {phone, smsCode} = data
      if (phone === '' || smsCode === '') {
        return this.$toast('请填写完整信息')
      } else if (phone === this.phone) {
        return this.$toast('手机号相同')
      }
      try {
        this.loading = true
        let result = await update({
          type: 'update',
          condition: { phone: this.phone },
          data: { phone: phone }
        })
        this.$toast(result.msg)
        if (result.status) {
          // 更改成功则更新本地数据并返回
          this.$store.commit(type.UPDATE_USER, result.data)
          this.$refs.updatePhone.clear()
          this.changePhoneShow = false
        }
      } catch (e) {
        console.err(e)
        this.$toast.fail('系统错误')
      } finally {
        this.loading = false
      }
    }
  },
  components: {
    'phone': () => import('../login/phone'),
    register
  }
}
</script>

<style scoped lang="stylus">
.header
  display flex
  justify-content space-between
  .avatar
    padding 10px
  .right
    line-height 120px
  .info
    width 60%
    text-align left
    p:nth-child(1)
      font-size 18px
</style>
