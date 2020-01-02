<template>
  <div>
    <van-sticky>
      <van-nav-bar
        title="待提交"
        left-arrow
        @click-left="$router.push({name: 'home'})">
      </van-nav-bar>
    </van-sticky>
    <!--      待提交清单-->
    <van-pull-refresh
      v-model="freshLoading"
      @refresh="onRefresh"
      style="overflow: visible"
    >
      <div style="min-height: 90vh">
        <task-item v-for="(item, index) in todoList"
                   :key="index"
                   :task="item"
                   @click.native="showDetail(item)"
        />
      </div>
    </van-pull-refresh>
    <!--      详情页面-->
    <van-popup
      v-model="detailShow"
      :lazy-render="true"
      position="bottom"
    >
      <upload :task="curTask" :show.sync="detailShow"/>
    </van-popup>
  </div>
</template>

<script>
import type from '../../../store/mutation-types'
import {mapState} from 'vuex'
import TaskItem from '../task/taskItem'
import {todoList} from '../../../api/api'
import Upload from './upload'
export default {
  name: 'myTask',
  components: {Upload, TaskItem},
  data () {
    return {
      detailShow: false,
      freshLoading: false,
      curTask: {}
    }
  },
  computed: {
    ...mapState({
      todoList: 'todoList',
      studentID: 'studentID'
    })
  },
  methods: {
    onRefresh () {
      this.$toast.loading({
        message: '更新数据...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      todoList({
        studentID: this.studentID
      }).then(res => {
        this.$store.commit(type.SET_TODOLIST, res.data)
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        this.freshLoading = false
        this.$toast.clear()
      })
    },
    showDetail (task) {
      this.curTask = task
      this.detailShow = true
    }
  },
  mounted () {
    this.onRefresh()
  }
}
</script>

<style scoped lang="stylus">

</style>
