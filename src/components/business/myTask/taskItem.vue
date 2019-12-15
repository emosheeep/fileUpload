<template>
    <div>
      <van-cell-group>
        <van-cell
          is-link
          :title="curTask.title"
          :value="curTask.content"/>
      </van-cell-group>
    </div>
</template>

<script>
export default {
  name: 'taskItem',
  props: {
    task: Object
  },
  data () {
    return {
      id: '',
      creator: '',
      title: '',
      content: '',
      deadline: Date.now(),
      userList: []
    }
  },
  computed: {
    curTask: {
      get () {
        return this.task
      },
      set (newVal) {

      }
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
