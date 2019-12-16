<template>
    <div>
      <van-nav-bar
        title="待提交"
        left-arrow
        @click-left="$router.push({name: 'home'})">
      </van-nav-bar>
      <van-pull-refresh
        v-model="freshLoading"
        @refresh="onRefresh"
        style="overflow: visible"
      >
        <van-list
          style="height: 500px"
          v-model="listLoading"
          :finished="finished"
          finished-text="没有更多了"
        >
          <div v-for="(item, index) in todoList" :key="index">
            {{item.title}}
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
</template>

<script>
import type from '../../../store/mutation-types'
import {mapState} from 'vuex'
export default {
  name: 'myTask',
  data () {
    return {
      listLoading: true,
      freshLoading: false,
      finished: false
    }
  },
  computed: {
    ...mapState({
      todoList: 'todoList'
    })
  },
  methods: {
    onRefresh () {
      this.load()
    },
    load () {
      this.$store.dispatch(type.SET_TODOLIST, () => {
        this.finished = true
        this.freshLoading = false
      })
    }
  },
  mounted () {
    if (this.todoList.length === 0) {
      this.load()
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
