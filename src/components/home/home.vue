<template>
    <div>
      <van-nav-bar title="我的主页" right-text="按钮"/>
<!--      头像模块-->
      <div class="header" @click="isLogin">
        <div class="avatar">
          <van-image round width="6rem" height="6rem" cover
                     src="https://img.yzcdn.cn/vant/cat.jpeg"/>
        </div>
        <div class="info">
          <div v-if="username">
            <p>{{username}}</p>
            <p>{{university.name}}</p>
          </div>
          <div v-else>
            <p>请先登录</p>
          </div>
        </div>
        <div class="right">
          <van-icon name="arrow"></van-icon>
        </div>
      </div>
      <van-divider style="margin: 0 0 10px 0"/>
      <!--      隐藏层-->
      <van-popup v-model="showInfo" position="right" style="width: 100%; height: 100%">
        <van-nav-bar title="个人信息" left-text="返回" left-arrow
                     @click-left="showInfo = false" />
<!--        基础信息-->
        <van-cell-group title="基本信息" :border="false">
          <van-cell title="账号" :value="phone" />
          <van-cell title="姓名" :value="username" />
          <van-cell title="学号" :value="studentID" />
          <van-cell title="学校" :value="university.name" />
        </van-cell-group>
        <van-divider style="margin: 0 0 20px 0"/>
        <van-cell-group title="操作" :border="false">
          <!--        手机号-->
          <van-cell title="换绑手机号" is-link @click="showPhoneChange" />
          <van-popup v-model="changePhoneShow" position="right" :lazy-render="false"
                     style="width: 100%; height: 100%">
            <van-nav-bar title="修改信息" left-arrow
                         @click-left="changePhoneShow = false"/>
            <phone submitText="确认" :loading="loading"
                   @submit="updatePhone" ref="updatePhone" />
          </van-popup>
          <!--        修改基础信息-->
          <van-cell title="修改资料" is-link @click="showUpdate" />
          <van-popup v-model="updateShow" position="right" :lazy-render="false"
                     style="width: 100%; height: 100%">
            <van-nav-bar title="修改信息" left-arrow
                         @click-left="updateShow = false"/>
            <register :updateShow.sync="updateShow" ref="updateInfo">
              <template v-slot:default="userInfo">
                <van-button size="large" :loading="loading"
                            @click="updateInfo(userInfo.user)">确认修改</van-button>
              </template>
            </register>
          </van-popup>
        </van-cell-group>
<!--        退出登录-->
        <van-button size="large" style="margin-top: 60px"
                    type="danger"
                    @click="logout">退出登录</van-button>
      </van-popup>
<!--      业务模块-->
      <van-grid :column-num="3" clickable >
        <van-grid-item icon="todo-list-o" text="待提交" to="/todoList"/>
        <van-grid-item icon="photo-o" text="我发布的" to="/myTask"/>
        <van-grid-item icon="photo-o" text="文字" />
      </van-grid>
      <van-cell is-link title="编辑联系人分组" to="/contact"/>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import _ from 'lodash'
import {update, logout} from '../../api/api'
import type from '../../store/mutation-types'
import register from '../login/register'
import GroupList from '../contact/groupList'
import GroupEdit from '../contact/groupEdit'
export default {
  name: 'home',
  data () {
    return {
      showInfo: false, // 控制资料选项卡
      updateShow: false, // 修改资料选项卡
      changePhoneShow: false, // 修改手机号
      userEditShow: false, // 常用联系人设置
      loading: false
    }
  },
  computed: {
    ...mapState({
      username: 'username',
      studentID: 'studentID',
      phone: 'phone',
      university: 'university'
    }),
    userInfo () {
      return {
        username: this.username,
        studentID: this.studentID,
        phone: this.phone,
        university: this.university
      }
    },
    type () {
      return this.chosenGroupId !== null ? 'edit' : 'add'
    }
  },
  methods: {
    isLogin () {
      // 判断本地信息是否还存在
      if (this.$store.getters.loginState) {
        return (this.showInfo = true)
      }
      this.$router.push({name: 'login'})
    },
    // 进入修改资料面板并变更数据
    showUpdate () {
      this.updateShow = true
      this.$refs.updateInfo.setUserInfo(this.userInfo)
    },
    // 进入手机号绑定界面并设置数据
    showPhoneChange () {
      this.changePhoneShow = true
      this.$refs.updatePhone.setDefaultPhone(this.phone)
    },
    showUserEdit () {
      this.userEditShow = true
    },
    // 退出登录
    async logout () {
      let beforeClose = function (action, done) {
        if (action === 'confirm') {
          setTimeout(done, 1000)
        } else {
          done()
        }
      }
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确认退出?',
          beforeClose
        })
        // 执行登出逻辑
        let result = await logout()
        if (result.status) {
          this.$store.commit(type.CLEAR_USER)
          this.showInfo = false
        } else {
          this.$toast.fail(result.msg)
        }
      } catch (e) {}
    },
    // 检查数据完整性，不完整返回false
    checkState (info) {
      // 利用lodash排除空值
      let values = _.values(info) // 对象属性值
      let result = _.compact(values)
      if (result.length !== values.length) {
        return false
      } else return true
    },
    // 修改基本信息 不包括账号（电话号码）
    async updateInfo (userInfo) {
      if (!this.checkState(userInfo)) {
        return this.$toast('请填写完整')
      }
      let localUserInfo = _.clone(this.userInfo)
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
      // 询问是否修改
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确认修改吗？'
        })
      } catch (e) { return }
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
      // 询问是否修改
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确认修改吗？'
        })
      } catch (e) { return }
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
    GroupEdit,
    GroupList,
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
    display flex
    flex-direction column
    justify-content space-around
    p
      margin 15px 0
      &:nth-child(1)
        font-size 18px

</style>
