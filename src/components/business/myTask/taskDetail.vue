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
        <slot>
          <van-tabs v-model="active" sticky>
            <van-tab title="未提交" />
            <van-tab title="已完成" />
          </van-tabs>
          <van-cell-group>
<!--            通过status和v-show来筛选已完成-->
            <van-cell v-show="item.status === active"
                      v-for="(item, index) in curTask.userList"
                      :key="index"
                      :title="item.username"
            >
              <van-tag plain
                       v-if="item.status === 0"
                       slot="right-icon"
                       type="warning">未完成</van-tag>
              <van-tag plain
                       v-else
                       slot="right-icon"
                       type="success">已提交</van-tag>
            </van-cell>
          </van-cell-group>
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

export default {
  name: 'taskDetail',
  props: {
    task: Object,
    type: String
  },
  data () {
    return {
      addTimeShow: false,
      showAction: false,
      dayNum: 0, // 延长天数
      active: 0,
      actions: [
        {name: '延长时间', color: 'green'},
        {name: '结束任务', subname: '不可逆'}
      ]
    }
  },
  computed: {
    curTask () {
      return this.task
    },
    time () {
      // 返回剩余时间
      return new Date(this.task.deadline).getTime() - Date.now()
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
