<template>
   <div>
     <van-sticky>
       <van-nav-bar
         title="文件下载"
         left-arrow
         @click-left="$router.push({name: 'home'})">
       </van-nav-bar>
     </van-sticky>
     <van-cell-group>
       <van-cell
         is-link
         size="large"
         icon="description"
         :title="item.title"
         :label="shortDesc(item.content)"
         v-for="(item, index) in task" :key="index"
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
    }),
    shortDesc () {
      return function (content) {
        if (content.length > 22) {
          return content.substring(0, 22) + '...'
        } else return content
      }
    }
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
