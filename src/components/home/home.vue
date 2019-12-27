<template>
    <div>
      <van-nav-bar title="我的主页" right-text="按钮"/>
<!--      头像模块-->
      <div class="header van-hairline--bottom" @click="isLogin">
        <div class="avatar">
          <van-image round width="5rem" height="5rem" cover
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
      <!--      隐藏层-->
      <van-popup v-model="showInfo" position="right" style="width: 100%; height: 100%">
        <van-nav-bar title="个人信息" left-text="返回" left-arrow @click-left="showInfo = false" />
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
            <register ref="updateInfo">
              <template v-slot:default="userInfo">
                <van-button size="large" :loading="loading"
                            @click="updateInfo(userInfo.user)">确认修改</van-button>
              </template>
            </register>
          </van-popup>
        </van-cell-group>
<!--        退出登录-->
        <van-button size="large" style="margin-top: 60px"
                    type="danger" round
                    @click="logout">退出登录</van-button>
      </van-popup>
<!--      业务模块-->
      <van-grid :column-num="3" clickable style="margin-top: 30px">
        <van-grid-item icon="todo-list-o" text="待提交" to="/todoList"/>
        <van-grid-item icon="records" text="发布任务" to="/myTask"/>
        <van-grid-item icon="down" text="文件下载" to="/files"/>
        <van-grid-item icon="contact" text="常用联系人" to="/contact"/>
      </van-grid>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import _ from 'lodash'
import {updatePhone, updateInfo} from '../../api/api'
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
      university: 'university',
      token: 'token'
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
      if (this.token === '') {
        return this.$router.push({name: 'login'})
      }
      this.showInfo = true
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
      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          // 清楚用户数据
          this.$store.commit(type.CLEAR_USER)
          // 清除localStorage缓存
          window.localStorage.clear()
          setTimeout(() => {
            done()
            this.$router.push({name: 'login'})
          }, 400)
        } else {
          done()
        }
      }
      this.$dialog.confirm({
        title: '提示',
        message: '确认退出?',
        beforeClose
      }).catch(e => e)
    },
    // 检查数据完整性，不完整返回false
    checkState (info) {
      // 检查数据是否填写完整
      let values = _.values(info) // 对象属性值
      let result = _.compact(values) // 去除空值
      // 判断数据是否发生变化
      let localUserInfo = _.omit(this.userInfo, 'phone') // 排除电话号码
      let equal = _.isEqual(localUserInfo, info)
      // 填写不完整或数据没有变化则返回false
      if (result.length !== values.length || equal) {
        this.$toast('信息无变化或不完整')
        return false
      } else return true
    },
    // 修改基本信息 不包括账号（电话号码）
    async updateInfo (userInfo) {
      if (!this.checkState(userInfo)) {
        return
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
        // 更新请求
        let result = await updateInfo({
          phone: this.phone,
          data: userInfo
        })
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
        let result = await updatePhone({
          origin: this.phone,
          phone,
          smsCode
        })
        this.$toast(result.msg)
        if (result.status) {
          let data = {
            ...result.data,
            token: result.token
          }
          console.log(data)
          // 更改成功则更新本地数据并返回
          this.$store.commit(type.UPDATE_USER, data)
          // 本地数据更新
          this.$store.commit(type.SET_USER_BY_PHONE, data.phone)
          this.$refs.updatePhone.clear()
          this.changePhoneShow = false
        }
      } catch (e) {
        console.error(e)
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
    line-height 100px
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
