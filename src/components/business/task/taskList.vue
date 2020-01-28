<template>
    <div>
      <van-sticky>
        <van-nav-bar
          title="我发布的"
          left-arrow
          @click-left="$router.push({name: 'home'})"
          @click-right="$router.push({name: 'addTask'})">
          <van-icon name="plus" slot="right" />
        </van-nav-bar>
      </van-sticky>
<!--      已发布记录显示-->
      <van-pull-refresh style="overflow: visible"
        v-model="isLoading"
        @refresh="onRefresh"
      >
        <div class="task-item-box">
          <div
            v-for="(item, index) in task"
            :key="index"
            @click.capture="showTaskDetail(item.title)"
          >
            <task-item :task="item"/>
          </div>
        </div>
      </van-pull-refresh>
    </div>
</template>

<script>
import { Sticky, PullRefresh } from 'vant'
import { mapState } from 'vuex'
import type from '../../../store/mutation-types'
import { throttle } from 'lodash'
export default {
  name: 'taskList',
  components: {
    TaskItem: () => import('./taskItem'),
    'van-sticky': Sticky,
    'van-pull-refresh': PullRefresh
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
      this.$router.push({ name: 'detail', query: { title } })
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
    this.$store.dispatch(type.SET_TASK) // 获取任务信息
  }, 60 * 1000)
}
</script>

<style scoped lang="stylus">
.task-item-box
  display flex
  flex-direction column
  height: calc(100vh - 50px)
</style>
