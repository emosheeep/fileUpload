<template>
    <div>
      <van-nav-bar
        title="待提交"
        left-arrow
        @click-left="$router.push({name: 'home'})">
      </van-nav-bar>
<!--      待提交清单-->
      <van-pull-refresh
        v-model="freshLoading"
        @refresh="onRefresh"
        style="overflow: visible"
      >
        <van-list
          style="height: 500px"
          v-model="listLoading"
          :finished="finished"
          finished-text="没有更多了"
        >
          <task-item v-for="(item, index) in todoList"
                     :key="index"
                     :task="item"
                     @click.native="showDetail(item)"
          />
        </van-list>
      </van-pull-refresh>
<!--      详情页面-->
      <van-popup
        v-model="detailShow"
        position="bottom"
        style="height: 100%"
      >
        <task-detail :show.sync="detailShow"
                     type="preview"
                     :task="curTask">
          <van-button
            type="primary"
            size="large"
            plain
            round
          >
            点击提交
          </van-button>
        </task-detail>
      </van-popup>
    </div>
</template>

<script>
import type from '../../../store/mutation-types'
import {mapState} from 'vuex'
import TaskItem from '../myTask/taskItem'
import TaskDetail from '../myTask/taskDetail'
export default {
  name: 'myTask',
  components: {TaskDetail, TaskItem},
  data () {
    return {
      detailShow: false,
      listLoading: false,
      freshLoading: false,
      finished: true,
      curTask: {}
    }
  },
  computed: {
    ...mapState({
      todoList: 'todoList'
    })
  },
  methods: {
    onRefresh () {
      this.$store.dispatch(type.SET_TODOLIST, () => {
        this.finished = true
        this.freshLoading = false
      })
    },
    showDetail (task) {
      this.curTask = task
      this.detailShow = true
    }
  },
  mounted () {
    if (this.todoList.length === 0) {
      this.listLoading = true
      this.finished = false
      this.$store.dispatch(type.SET_TODOLIST, () => {
        this.finished = true
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
