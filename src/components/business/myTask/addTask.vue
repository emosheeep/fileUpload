<template>
  <div>
    <van-cell-group title="填写信息">
      <van-field v-model="title"
                 label="标题" required
                 placeholder="请输入标题"
      />
      <van-field v-model="content"
                 rows="2"
                 autosize
                 label="描述"
                 type="textarea"
                 maxlength="60"
                 placeholder="简要描述任务要求"
                 show-word-limit
      />
      <van-field readonly
                 clickable
                 label="截止日期"
                 v-model="computedTime"
                 placeholder="选择截止日期"
                 @click="timePickerShow = true"
      />
      <van-popup v-model="timePickerShow"
                 position="bottom"
                 :style="{ height: '40%' }">
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
      <van-cell-group  title="选择提交人">
        <van-cell
          v-for="(item, index) in contactGroups"
          clickable
          :key="item"
          :title="item"
          @click="toggle(index)"
        >
          <van-checkbox
            :name="item"
            ref="checkboxes"
            slot="right-icon"
          />
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
    <van-button round
                size="large"
                type="info"
                style="position: fixed; bottom: 5%"
                @click="addRecord">发布任务</van-button>
  </div>
</template>

<script>
import _ from 'lodash'
import {mapState} from 'vuex'
export default {
  name: 'addTask',
  props: {
    show: Boolean
  },
  data () {
    return {
      // 时间选择器
      timePickerShow: false,
      minDate: new Date(), // 截止时间默认一天后
      maxDate: new Date(Date.now() + 24 * 3600 * 1000 * 31), // 最长一个月
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
      let year = this.tempTime.getFullYear()
      let month = String(this.tempTime.getMonth() + 1).padStart(2, '0')
      let day = String(this.tempTime.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    contactGroups () {
      return this.$store.state.contact.map((item) => {
        return item.name
      })
    },
    ...mapState({
      contact: 'contact'
    })
  },
  watch: {
    tempTime (newVal) {
      let time = this.getDayTime(newVal) // 时间归零
      time = time.getTime() + (23 * 3600 + 3599) * 1000 // 当天的23:59秒截止
      this.deadline = new Date(time)
    }
  },
  methods: {
    // 将某天的时间归零
    getDayTime (time) {
      return new Date(time.getFullYear(), time.getMonth(), time.getDate())
    },
    // 检查是否填完信息
    checkState () {
      let data = [
        this.title,
        this.content,
        this.userList.length
      ]
      let result = _.compact(data)
      if (result.length !== data.length) {
        return false
      } else return true
    },
    addRecord () {
      if (!this.checkState()) {
        return this.$toast('请填写完整')
      }
      // 获取选中组别包含的所有联系人
      let list = _.reduce(this.contact, (result, item) => {
        if (_.indexOf(this.userList, item.name) !== -1) {
          result = result.concat(item.userList)
        }
        return result
      }, [])
      list = _.uniqBy(list, 'studentID') // 按照学号去重
      list = list.map((item) => { // 添加是否提交的状态，默认false，标识未提交
        item.status = false
        return item
      })
      let data = {
        id: Date.now(),
        creator: this.$store.state.phone,
        title: this.title,
        content: this.content,
        startTime: new Date(),
        deadline: this.deadline, // Date格式
        userList: list
      }
      this.$emit('save', data)
      this.clearData()
      this.$emit('update:show', false)
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle()
    },
    clearData () {
      this.title = ''
      this.content = ''
      this.userList = []
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
