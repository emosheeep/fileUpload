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
      :lazy-render="true"
      position="bottom"
      style="height: 100%"
    >
      <task-detail :show.sync="detailShow"
                   type="preview"
                   :task="curTask">
        <!--          文件上传-->
        <upload :task="curTask"/>
      </task-detail>
    </van-popup>
  </div>
</template>

<script>
import type from '../../../store/mutation-types'
import {mapState} from 'vuex'
import TaskItem from '../myTask/taskItem'
import TaskDetail from '../myTask/taskDetail'
import {todoList} from '../../../api/api'
import Upload from './upload'
export default {
  name: 'myTask',
  components: {Upload, TaskDetail, TaskItem},
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
      todoList: 'todoList',
      studentID: 'studentID'
    })
  },
  methods: {
    onRefresh () {
      todoList({
        studentID: this.studentID
      }).then(res => {
        this.$store.commit(type.SET_TODOLIST, res.data)
      }).catch(e => {
        console.warn('身份过期，请重新登录')
        if (e.message.indexOf('401') !== -1) {
          this.$toast('请登录')
          this.$router.push({name: 'login'})
        }
      }).finally(() => {
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
      this.finished = false
      this.listLoading = true
      this.onRefresh()
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
