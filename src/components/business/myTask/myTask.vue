<template>
    <div>
      <van-nav-bar
        title="我发布的"
        left-arrow
        @click-left="$router.push({name: 'home'})"
        @click-right="addTaskShow = true">
        <van-icon name="plus" slot="right" />
      </van-nav-bar>
<!--      添加记录弹层-->
      <van-popup
        v-model="addTaskShow"
        position="right"
        :style="{ width: '100%', height: '100%' }">
        <van-nav-bar
          title="发布任务"
          left-arrow
          @click-left="addTaskShow = false" />
        <add-task
          @save="onSave"
          @del="onDelete"
          :show.sync="addTaskShow" />
      </van-popup>
<!--      已发布记录显示-->
      <van-pull-refresh style="overflow: visible"
        v-model="isLoading"
        @refresh="onRefresh"
      >
        <task-item v-for="(item, index) in taskList" :key="index"
                   :task="item"
                   @click.native="showTaskDetail(item)"
        />
      </van-pull-refresh>
<!--      任务详情界面-->
      <van-popup v-model="showDetail" position="bottom" style="height: 100%">
        <task-detail
          :show.sync="showDetail"
          :task="curTask"
          @del="onDelete"
        />
      </van-popup>
    </div>
</template>

<script>
import type from '../../../store/mutation-types'
import AddTask from './addTask'
import TaskItem from './taskItem'
import TaskDetail from './taskDetail'
export default {
  name: 'myTask',
  components: {TaskDetail, TaskItem, AddTask},
  data () {
    return {
      isLoading: false,
      showDetail: false, // 任务详情界面
      addTaskShow: false, // 发布任务界面显示
      taskList: [],
      curTask: {}
    }
  },
  watch: {
    taskList (newVal, oldValue) {
      if (oldValue.length === 0) { // 过滤首次
        return
      }
      this.$store.commit(type.SET_TASK, newVal)
    }
  },
  methods: {
    // 添加一个任务
    async onSave (task) {
      this.taskList.push(task)
    },
    // 删除一个任务
    onDelete (task) {
      this.taskList = this.taskList.filter((item) => {
        return task.id !== item.id
      })
    },
    showTaskDetail (task) {
      this.curTask = task
      this.showDetail = true
    },
    // 刷新列表数据
    onRefresh () {
      setTimeout(() => {
        this.taskList = this.$store.state.task
        this.isLoading = false
      }, 500)
    }
  },
  mounted () {
    this.taskList = this.$store.state.task // 获取任务信息
  }
}
</script>

<style scoped lang="stylus">

</style>
