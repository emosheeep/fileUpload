<template>
    <div>
      <van-nav-bar title="我的主页" right-text="按钮"/>
<!--      头像模块-->
      <div class="header van-hairline--bottom" @click="$router.push({name: 'info'})">
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
          <van-icon name="arrow" />
        </div>
      </div>
<!--      业务模块-->
      <van-grid :column-num="3" clickable style="margin-top: 30px">
        <van-grid-item icon="todo-list-o" text="待提交" to="/todoList"/>
        <van-grid-item icon="records" text="发布任务" to="/task/list"/>
        <van-grid-item icon="down" text="文件下载" to="/files"/>
        <van-grid-item icon="contact" text="常用联系人" to="/contact/groups"/>
      </van-grid>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import GroupList from '../contact/groupItem'
import GroupEdit from '../contact/groupEdit'
export default {
  name: 'home',
  components: {
    GroupEdit,
    GroupList
  },
  computed: mapState({
    username: 'username',
    university: 'university'
  })
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
