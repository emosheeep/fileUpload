<template>
  <div>
    <!-- 联系人小组-->
    <van-swipe-cell v-for="(item, index) in list" :key="index" :right-width="120">
      <van-cell is-link :title="item.name"
                @click="showMember(item.name)" />
      <template slot="right">
        <van-button square type="danger" text="删除" @click="removeGroup(item)"/>
        <van-button square type="primary" text="编辑" @click="editGroup(item)"/>
      </template>
    </van-swipe-cell>
  </div>
</template>

<script>
import { SwipeCell } from 'vant'
export default {
  name: 'groupList',
  components: {
    'van-swipe-cell': SwipeCell
  },
  props: {
    list: Array // 小组对象数组
  },
  data () {
    return {
      chosenUserId: null
    }
  },
  computed: {
    type () {
      return this.chosenUserId !== null ? 'edit' : 'add'
    }
  },
  methods: {
    editGroup (groupUser) {
      this.$emit('edit', groupUser) // 触发自定义事件
    },
    removeGroup (groupUser) {
      this.$emit('del', groupUser)
    },
    showMember (groupName) {
      this.$router.push({
        name: 'members',
        query: { title: groupName }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
>>> .van-swipe-cell__right
      display flex
</style>
