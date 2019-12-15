<template>
    <div>
      <van-nav-bar
        title="我发布的"
        left-arrow
        @click-left="$router.push({name: 'home'})"
        @click-right="addRecordShow = true">
        <van-icon name="plus" slot="right" />
      </van-nav-bar>
<!--      添加记录弹层-->
      <van-popup
        v-model="addRecordShow"
        position="right"
        :style="{ width: '100%', height: '100%' }">
        <van-nav-bar
          title="发布任务"
          left-arrow
          @click-left="addRecordShow = false" />
        <add-task @save="onSave" :show.sync="addRecordShow" />
      </van-popup>
<!--      已发布记录显示-->
      <task-item v-for="(item, index) in taskList" :key="index"
                 :task="item"/>
    </div>
</template>

<script>
import type from '../../../store/mutation-types'
import AddTask from './addTask'
import TaskItem from './taskItem'
export default {
  name: 'myListSet',
  components: {TaskItem, AddTask},
  data () {
    return {
      addRecordShow: false, // 发布任务界面显示
      taskList: [],
      curTask: {}
    }
  },
  watch: {
    taskList (newVal, oldValue) {
      if (oldValue.length === 0) { // 过滤首次
        return
      }
      this.$store.dispatch(type.SET_TASK, newVal)
    }
  },
  methods: {
    onSave (task) {
      this.taskList.push(task)
    }
  },
  mounted () {
    this.taskList = this.$store.state.task // 获取任务信息
  }
}
</script>

<style scoped lang="stylus">

</style>
