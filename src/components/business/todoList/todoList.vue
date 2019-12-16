<template>
    <div>
      <van-nav-bar
        title="待提交"
        left-arrow
        @click-left="$router.push({name: 'home'})">
      </van-nav-bar>
      <div v-for="(item, index) in todoList" :key="index">
        {{item.title}}
      </div>
    </div>
</template>

<script>
import type from '../../../store/mutation-types'
import {mapState} from 'vuex'
export default {
  name: 'myTask',
  computed: {
    ...mapState({
      todoList: 'todoList'
    })
  },
  mounted () {
    this.$store.dispatch(type.SET_TODOLIST)
  }
}
</script>

<style scoped lang="stylus">

</style>
