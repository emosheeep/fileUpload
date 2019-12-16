<template>
    <div class="van-hairline--bottom box">
      <van-row class="box-header">
        <van-col span="16">{{curTask.title}}</van-col>
      </van-row>
      <van-row class="box-body">
        <van-col span="24" class="van-ellipsis">
          {{curTask.content}}
        </van-col>
      </van-row>
      <van-row class="box-footer">
        <van-col span="16">
          <van-count-down :time="time" class="count-down"
                          format="DD 天 HH 时 mm 分 ss 秒"/>
        </van-col>
        <van-col span="8" style="text-align: right">
          <van-tag plain>
            {{status.length}}/{{curTask.userList.length}}
          </van-tag>
        </van-col>
      </van-row>
    </div>
</template>

<script>
export default {
  name: 'taskItem',
  props: {
    task: Object
  },
  data () {
    return {
      id: '',
      creator: '',
      title: '',
      content: '',
      deadline: Date.now(),
      userList: []
    }
  },
  computed: {
    curTask () {
      return this.task
    },
    time () {
      // 返回剩余时间
      return new Date(this.task.deadline).getTime() - Date.now()
    },
    status () {
      // 显示完成状态
      return this.curTask.userList.filter(item => item.status === true)
    }
  }
}
</script>

<style scoped lang="stylus">
.count-down
  color teal
  transform-origin left
  transform scale(0.8)
.box
  padding 5px
.box-header
  font-size 15px
  font-weight bold
.box-body
  color grey
</style>
