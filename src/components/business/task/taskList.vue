<template>
    <div>
      <van-nav-bar
        title="我发布的"
        left-arrow
        @click-left="$router.push({name: 'home'})"
        @click-right="$router.push({name: 'addTask'})">
        <van-icon name="plus" slot="right" />
      </van-nav-bar>
<!--      已发布记录显示-->
      <van-pull-refresh style="overflow: visible"
        v-model="isLoading"
        @refresh="onRefresh"
      >
        <div class="task-item-box">
          <task-item
            v-for="(item, index) in task" :key="index"
            :task="item"
            @click.native="showTaskDetail(item.title)"
          />
        </div>
      </van-pull-refresh>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import type from '../../../store/mutation-types'
import {throttle} from 'lodash'
export default {
  name: 'myTask',
  components: {
    TaskDetail: () => import('./taskDetail'),
    TaskItem: () => import('./taskItem')
  },
  data () {
    return {
      isLoading: false,
      showDetail: false // 任务详情界面
    }
  },
  computed: mapState({
    task: 'task'
  }),
  methods: {
    showTaskDetail (title) {
      this.$router.push({name: 'detail', query: { title }})
    },
    // 刷新列表数据
    onRefresh () {
      this.$store.dispatch(type.SET_TASK, () => {
        this.isLoading = false
      })
    }
  },
  // 自动查询操作需要节流
  created: throttle(function () {
    console.log(this)
    this.$store.dispatch(type.SET_TASK) // 获取任务信息
  }, 60 * 1000)
}
</script>

<style scoped lang="stylus">
.task-item-box
  height 500px
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
