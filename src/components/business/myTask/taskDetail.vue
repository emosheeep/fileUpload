<template>
    <div>
<!--      导航栏-->
      <van-nav-bar
        title="任务详情"
        left-arrow
        @click-left="$emit('update:show', false)"
        @click-right="showAction = true">
        <van-icon name="bars" slot="right"  v-if="type !== 'preview'"/>
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
<!--        插槽-->
        <slot>
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
                         slot="right-icon"
                         type="success">已提交</van-tag>
              </van-cell>
            </van-tab>
          </van-tabs>
        </slot>
      </van-panel>
<!--      增加时间-->
      <van-dialog
        v-model="addTimeShow"
        title="选择天数"
        @confirm="addTime"
        show-cancel-button >
        <div class="add-time">
          <van-stepper v-model="dayNum" min="1" max="10"/>
        </div>
      </van-dialog>
    </div>
</template>

<script>
import {removeTask, updateTask} from '../../../api/api'
import upyun from '../../../api/upyun'
export default {
  name: 'taskDetail',
  props: {
    task: Object,
    type: String
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
        {name: '延长时间', color: 'green'},
        {name: '结束任务', subname: '不可逆'}
      ],
      complete: [] // 已完成人员
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
      let timeStamp = new Date(this.task.deadline).getTime() + this.dayNum * 24 * 3600 * 1000
      let deadline = new Date(timeStamp) // 新的截止日期
      let task = JSON.parse(JSON.stringify(this.curTask))
      task.deadline = deadline
      // 开始请求
      this.$toast.loading({
        loadingType: 'spinner',
        duration: 0,
        forbidClick: true
      })
      updateTask({task: task}).then(result => {
        if (result.status) {
          this.$emit('edit', task) // 更新本地数据
          this.curTask.deadline = deadline // 更新视图
          this.$toast.clear()
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
      }).then(async () => {
        try {
          this.$toast.loading({
            loadingType: 'spinner',
            duration: 0,
            forbidClick: true
          })
          let result = await removeTask({task: this.task})
          if (result.status) {
            this.$emit('del', this.task)
            this.$emit('update:show', false)
          } else this.$toast.fail('删除失败')
        } catch (e) {
          console.error(e)
          this.$toast.fail('删除失败')
        } finally { this.$toast.clear() } // 停止加载
      }).catch()
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
      let path = `/upload/${this.task.creator}/${this.task.title}`
      this.loading = true
      upyun.listDir(path).then(res => {
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
