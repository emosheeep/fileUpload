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
import { mapState } from 'vuex'
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
    group: { // 初始化组件信息
      handler (newVal) {
        this.name = newVal.name
        this.id = newVal.id
        this.userList = newVal.userList
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      groupName: state => state.contact.map(item => item.name)
    }),
    userInfo () {
      return {
        name: this.name,
        id: this.id,
        userList: this.userList
      }
    }
  },
  methods: {
    checkState () {
      if (this.name === '') {
        this.$toast('请填写完整')
        return false
      }
      if (this.type === 'edit') {
        return true // 编辑模式不继续校验
      }
      // 添加模式
      for (let name of this.groupName) {
        if (name === this.name) {
          this.$toast('该小组已经存在')
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
