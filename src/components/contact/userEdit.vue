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
export default {
  name: 'userEdit',
  props: {
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
    }
  },
  methods: {
    save () {
      this.$emit('save', this.userInfo)
    },
    remove () {
      this.$emit('del', this.userInfo)
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
