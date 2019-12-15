<template>
  <div>
    <van-field
      v-model="name"
      autofocus
      clearable
      label="小组名"
      placeholder="请输入小组名称"
    />

    <van-button type="danger" size="large" round
                @click="save">保存</van-button>
    <van-button size="large" round v-if="type === 'edit'"
                @click="remove">删除</van-button>
  </div>
</template>

<script>
export default {
  name: 'groupEdit',
  props: {
    group: Object,
    type: String // 编辑模式或新增
  },
  data () {
    return {
      name: '', // 小组名
      id: '',
      userList: []
    }
  },
  watch: {
    group: {
      handler (newVal) {
        this.name = newVal.name
        this.id = newVal.id
        this.userList = newVal.userList
      },
      immediate: true
    }
  },
  computed: {
    userInfo () {
      return {
        name: this.name,
        id: this.id,
        userList: this.userList
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
