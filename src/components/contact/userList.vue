<template>
    <div>
      <!-- 联系人小组-->
      <van-swipe-cell v-for="(item, index) in list" :key="index">
        <van-cell :title="item.username" :value="item.studentID"
                  @click="edit(item)">
          <van-icon slot="right-icon" name="edit"
                    style="line-height: inherit;margin-left: 10px"/>
        </van-cell>
        <template slot="right">
          <van-button square type="danger" text="删除" @click="remove(item)"/>
        </template>
      </van-swipe-cell>
    </div>
</template>

<script>
export default {
  name: 'userList',
  props: {
    list: Array // 对象数组
  },
  methods: {
    edit (user) {
      // 触发自定义事件
      this.$emit('edit', user)
    },
    remove (user) {
      this.$emit('del', user)
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
