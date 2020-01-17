<template>
    <div>
<!--      导航栏-->
      <van-nav-bar
        title="任务详情"
        left-arrow
        @click-left="$router.go(-1)"
        @click-right="showAction = true">
        <van-icon name="bars" slot="right"/>
      </van-nav-bar>
      <van-action-sheet
        v-model="showAction"
        :actions="actions"
        cancel-text="取消"
        :close-on-click-action="true"
        @select="onSelect" />
<!--      详情-->
      <van-panel :title="curTask.title" :desc="curTask.content">
        <div class="time-info">
          <span>开始时间：{{timeFormat(curTask.startTime)}}</span>&nbsp;
          <span>截止时间：{{timeFormat(curTask.deadline)}}</span>
          <van-count-down
            :time="time"
            style="color: orangered"
            format="剩余时间：DD 天 HH 时 mm 分 ss 秒"
          />
        </div>
        <van-button
          @click="refresh"
          :loading="loading"
          size="large"
          type="primary">点击查看完成情况</van-button>
        <van-tabs v-model="active"
                  v-if="completeShow"
                  animated
                  sticky
        >
          <van-tab title="未提交">
            <van-cell v-for="(item, index) in curTask.userList"
                      v-show="filter(item)"
                      :key="index"
                      :title="item.username">
              <van-tag plain
                       slot="right-icon"
                       type="warning">未完成</van-tag>
            </van-cell>
          </van-tab>
          <van-tab title="已完成">
            <van-cell v-for="(item, index) in complete"
                      :key="index"
                      :title="item.username"
                      :value="new Date(item.time).toLocaleDateString()"
            >
              <van-tag plain
                       style="margin-left: 10px"
                       slot="right-icon"
                       type="success">已提交</van-tag>
            </van-cell>
          </van-tab>
        </van-tabs>
      </van-panel>
<!--      增加时间-->
      <van-dialog
        v-model="addTimeShow"
        title="选择天数"
        @confirm="addTime"
        show-cancel-button >
        <div class="add-time">
          <van-stepper
            v-model="dayNum"
            min="1" max="10"
            input-width="80px"
            button-size="45px"
          />
        </div>
      </van-dialog>
    </div>
</template>

<script>
import {
  ActionSheet, Panel, CountDown, Stepper,
  Tab, Tabs, Tag
} from 'vant'
import { mapState } from 'vuex'
import type from '../../../store/mutation-types'
import { removeTask, updateTask } from '../../../api/api'
import { client } from '../../../api/upyun'
export default {
  name: 'taskDetail',
  props: {
    title: String
  },
  components: {
    'van-action-sheet': ActionSheet,
    'van-panel': Panel,
    'van-count-down': CountDown,
    'van-stepper': Stepper,
    'van-tag': Tag,
    'van-tab': Tab,
    'van-tabs': Tabs
  },
  data () {
    return {
      loading: false,
      addTimeShow: false,
      completeShow: false, // 显示完成情况
      showAction: false,
      dayNum: 0, // 延长天数
      active: 0, // 当前项
      actions: [
        { name: '延长时间', color: 'green' },
        { name: '结束任务', subname: '不可逆' }
      ],
      complete: [] // 已完成人员
    }
  },
  computed: {
    ...mapState({
      task: 'task'
    }),
    curTask () {
      let curTask = this.task.filter(item => item.title === this.title)
      return curTask[0]
    },
    time () {
      // 返回剩余时间
      return new Date(this.curTask.deadline).getTime() - Date.now()
    },
    // 筛选未完成的人
    filter () {
      return function (user) {
        for (let item of this.complete) {
          if (item.studentID === user.studentID) {
            return false
          }
        }
        return true // 已完成列表中没有找到，说明当前user没有完成，返回true
      }
    }
  },
  methods: {
    onSelect (item, index) {
      switch (index) {
        case 0: this.addTimeShow = true; break
        case 1: this.onDelete(); break
      }
    },
    addTime () {
      let timeStamp = new Date(this.curTask.deadline).getTime() + this.dayNum * 24 * 3600 * 1000
      let deadline = new Date(timeStamp) // 新的截止日期
      let task = JSON.parse(JSON.stringify(this.curTask))
      task.deadline = deadline
      // 开始请求
      this.$toast.loading({
        loadingType: 'spinner',
        duration: 0,
        forbidClick: true
      })
      updateTask({ task: task }).then(result => {
        if (result.status) {
          this.$store.commit(type.UPDATE_TASK, task)
          this.curTask.deadline = deadline // 更新视图
          this.$toast.success('成功')
        } else this.$toast.fail('更新失败')
      }).catch(e => {
        console.error(e)
        this.$toast.fail('更新失败')
      })
    },
    onDelete () {
      this.$dialog.confirm({
        title: '警告',
        message: '您确定结束该任务？结束后该任务将被删除'
      }).then(() => {
        this.$toast.loading({
          message: '请稍后...',
          forbidClick: true,
          loadingType: 'spinner',
          duration: 0
        })
        // 返回promise替代
        return removeTask({ task: this.curTask })
      }).then(result => {
        if (result.status) {
          // 提交更改，关闭弹框，返回上一级
          this.$store.commit(type.DELETE_TASK, this.curTask)
          this.$router.go(-1)
          this.$toast.success('成功')
        } else this.$toast.fail('删除失败')
      }).catch(e => {
        this.$toast.fail('删除失败')
        console.error(e)
      })
    },
    timeFormat (time) {
      time = new Date(time)
      let year = time.getFullYear()
      let month = String(time.getMonth() + 1).padStart(2, '0')
      let day = String(time.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    // 通过从云存储空间获取信息，判断当前已经提交的人数
    refresh () {
      let path = `/upload/${this.curTask.creator}/${this.curTask.title}`
      this.loading = true
      client.listDir(path).then(res => {
        this.compare(res)
      }).catch(e => {
        console.error(e.message)
      }).finally(() => {
        this.loading = false
      })
    },
    // 比对确定哪些人完成了
    compare (res) {
      this.completeShow = true
      if (!res) {
        this.complete = []
        return
      }
      this.complete = res.files.map(item => {
        let filename = item.name
        let studentID = filename.split('-')[0]
        let username = filename.match(/-(.*?)\./)[1] // 文件名中匹配姓名
        return {
          studentID: studentID,
          username: username,
          time: item.time * 1000 // 平台传回的是10位时间戳，需转换为13位才能被正确识别
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.time-info
  padding 10px
  font-size 1.1em
.add-time
  height 60px
  line-height 60px
  text-align center
</style>
