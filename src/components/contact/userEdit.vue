<template>
  <div>
    <van-field
      v-model="username"
      clearable
      label="姓名"
      placeholder="请输入姓名"
    />

    <van-field
      v-model="studentID"
      clearable
      type="number"
      label="学号"
      placeholder="请输入学号"
    />

    <van-button type="danger" size="large" round
                @click="save">保存</van-button>
    <van-button size="large" round v-if="type === 'edit'"
                @click="remove">删除</van-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'userEdit',
  props: {
    groupName: String,
    user: Object,
    type: String
  },
  data () {
    return {
      username: '',
      studentID: '',
      id: ''
    }
  },
  watch: {
    user: {
      handler (newVal) {
        this.username = newVal.username
        this.studentID = newVal.studentID
        this.id = newVal.id
      },
      immediate: true
    }
  },
  computed: {
    userInfo () {
      return {
        username: this.username,
        studentID: this.studentID,
        id: this.id
      }
    },
    ...mapState({
      existedID (state) {
        let group = state.contact.find(item => item.name === this.groupName)
        return group.userList.map(item => item.studentID)
      }
    })
  },
  methods: {
    checkState () {
      if (this.studentID === '' || this.username === '') {
        this.$toast('请填写完整')
        return false
      }
      if (this.type === 'edit') {
        return true // 编辑模式不校验
      }
      // 添加模式
      for (let id of this.existedID) {
        if (id === this.studentID) {
          this.$toast('该学号已经存在')
          return false
        }
      }
      return true
    },
    save () {
      if (this.checkState()) {
        this.$emit('save', this.userInfo)
      }
    },
    remove () {
      this.$emit('del', this.userInfo)
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
