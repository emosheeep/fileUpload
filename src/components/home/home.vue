<template>
    <div>
      <van-nav-bar title="我的主页" right-text="按钮"/>
      <div class="header" @click="myInfo">
        <div class="avatar">
          <van-image round width="6rem" height="6rem" cover
                     src="https://img.yzcdn.cn/vant/cat.jpeg"/>
        </div>
        <div class="info">
          <p>{{username}}</p>
          <p>{{school.name}}</p>
        </div>
        <div class="right">
          <van-icon name="arrow"></van-icon>
        </div>
      </div>
      <van-divider style="margin: 1px 0"/>
    </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      username: '秦旭洋',
      studentID: '8002117359',
      phone: '15591453874',
      school: {
        name: '南昌大学',
        id: 12345678
      }
    }
  },
  methods: {
    myInfo () {
      // 获取本地登陆状态
      let localState = this.$cookie.get('localUser')
      if (!localState) {
        return this.$router.push({name: 'login'})
      }
      console.log(localState)
    }
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
