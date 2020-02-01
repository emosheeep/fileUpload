<template>
  <div>
    <van-nav-bar
      title="发布任务"
      left-arrow
      @click-left="goBack" />
    <van-cell-group title="填写信息">
      <van-field
        v-model="title"
        label="标题" required
        placeholder="请输入标题"
        show-word-limit
        maxlength="15"
      />
      <van-field
        v-model="content"
        rows="2"
        autosize
        label="描述"
        type="textarea"
        placeholder="简要描述任务要求"
        show-word-limit
        maxlength="60"
      />
      <van-field
        readonly
        clickable
        label="截止日期"
        v-model="computedTime"
        placeholder="选择截止日期"
        @click="timePickerShow = true"
      />
      <van-popup
        v-model="timePickerShow"
        position="bottom"
        :style="{ height: '40%' }"
      >
        <van-datetime-picker
          @cancel="timePickerShow = false"
          @confirm="timePickerShow = false"
          v-model="tempTime"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </van-popup>
    </van-cell-group>
    <van-checkbox-group v-model="userList">
      <van-cell-group
        title="选择提交人"
        :border="false"
        style="height: 180px; overflow: auto"
      >
        <van-cell
          v-for="(item, index) in contact"
          clickable
          :key="index"
          :title="item.name"
          :value="`${item.userList.length}人`"
          @click="toggle(index)"
        >
          <van-checkbox
            :name="item"
            slot="right-icon"
            ref="checkboxes"
            style="margin-left: 10px"
          />
        </van-cell>
        <van-cell
          v-if="contact.length === 0"
          title="请先编辑常用联系人组！"
          style="text-align: center; color: red; font-size: 18px"
        />
      </van-cell-group>
    </van-checkbox-group>
    <van-button
      round
      size="large"
      type="info"
      :loading="loading"
      style="position: fixed; bottom: 2%"
      @click="addRecord"
    >发布任务</van-button>
  </div>
</template>

<script>
import {
  CellGroup, Field, Checkbox,
  CheckboxGroup, DatetimePicker, Popup
} from 'vant'
import _ from 'lodash'
import moment from 'moment'
import { mapState } from 'vuex'
import { addTask } from '../../../api/api'
import type from '../../../store/mutation-types'
export default {
  name: 'addTask',
  components: {
    'van-cell-group': CellGroup,
    'van-field': Field,
    'van-checkbox': Checkbox,
    'van-checkbox-group': CheckboxGroup,
    'van-datetime-picker': DatetimePicker,
    'van-popup': Popup
  },
  data () {
    return {
      loading: false, // 按钮状态
      // 时间选择器
      timePickerShow: false,
      minDate: new Date(), // 截止时间默认一天后
      maxDate: moment().add(1, 'M').valueOf(), // 最长一个月
      tempTime: new Date(), // 截止时间默认一天后
      // 组件数据
      timeChange: false, // 标识时间变化，确认用户是否选择了日期
      title: '',
      content: '',
      deadline: new Date(), // 通过watch设置截止时间
      userList: [] // 保存需要提交任务的用户
    }
  },
  computed: {
    computedTime () {
      return moment(this.tempTime).format('YYYY-MM-DD')
    },
    ...mapState({
      contact: 'contact',
      university: 'university',
      task: 'task'
    })
  },
  methods: {
    // 检查信息
    checkState () {
      let title = this.task.filter(item => item.title === this.title)
      if (title.length !== 0) {
        this.$toast('任务已存在')
        return false
      }
      let data = [
        this.title,
        this.content,
        this.userList.length
      ]
      let result = _.compact(data)
      if (result.length !== data.length) {
        this.$toast('请填写完整')
        return false
      } else return true
    },
    createTask () {
      let userList = this.userList.map(item => item.name)
      // 获取选中组别包含的所有联系人
      let list = _.reduce(this.contact, (result, item) => {
        if (_.includes(userList, item.name)) {
          result = result.concat(item.userList)
        }
        return result
      }, [])
      list = _.uniqBy(list, val => {
        return val.studentID // 按照学号去重
      })
      return {
        id: String(Date.now()),
        creator: this.$store.state.phone,
        title: this.title,
        content: this.content,
        university: this.university.id,
        startTime: new Date(),
        deadline: this.deadline, // Date格式
        userList: list
      }
    },
    addRecord () {
      if (!this.checkState()) {
        return
      }
      let task = this.createTask()
      this.loading = true // 开始加载
      addTask({
        task
      }).then(result => {
        if (result.status) {
          this.$store.commit(type.ADD_TASK, task)
          this.$toast.success('成功')
          this.goBack()
        } else {
          this.$toast.fail('发布失败')
        }
      }).catch(e => {
        this.$toast.fail('发布失败')
      }).finally(() => {
        this.loading = false
      })
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle()
    },
    clearData () {
      this.title = ''
      this.content = ''
      this.userList = []
    },
    goBack () {
      this.clearData()
      this.$router.go(-1)
    }
  },
  mounted () {
    this.tempTime = moment().startOf('day').valueOf()
    this.deadline = moment().endOf('day').valueOf()
  }
}
</script>

<style scoped lang="stylus">

</style>
