<template>
   <div>
     <van-nav-bar
       title="文件下载"
       left-arrow
       @click-left="$router.push({name: 'home'})">
     </van-nav-bar>
     <van-cell-group>
       <van-cell
         is-link
         size="large"
         v-for="(item, index) in task" :key="index"
         :title="item.title"
         @click="preview(item.title)"
       />
     </van-cell-group>
   </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'download',
  data () {
    return {
      activeName: ''
    }
  },
  computed: {
    ...mapState({
      task: 'task',
      phone: 'phone',
      domain: 'domain'
    })
  },
  methods: {
    preview (title) {
      this.$router.push({
        path: '/preview',
        query: { title }
      })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
