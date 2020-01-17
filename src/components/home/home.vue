<template>
    <div>
      <van-nav-bar title="我的主页"/>
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
      <Grid :column-num="3" clickable style="margin-top: 30px">
        <GridItem icon="todo-list-o" text="待提交" to="/todoList"/>
        <GridItem icon="records" text="发布任务" to="/task/list"/>
        <GridItem icon="down" text="文件下载" to="/files"/>
        <GridItem icon="contact" text="常用联系人" to="/contact/groups"/>
      </Grid>
    </div>
</template>

<script>
import { Image, Grid, GridItem } from 'vant'
import { mapState } from 'vuex'
export default {
  name: 'home',
  components: {
    'van-image': Image,
    Grid,
    GridItem
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
