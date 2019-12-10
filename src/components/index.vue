<template>
    <div>
      <keep-alive>
        <component :is="container[active]"></component>
      </keep-alive>
      <van-tabbar v-model="active">
        <van-tabbar-item icon="search">标签</van-tabbar-item>
        <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
      </van-tabbar>
    </div>
</template>

<script>
import home from './home/home'
export default {
  name: 'index',
  data () {
    return {
      active: 1,
      container: ['', 'home']
    }
  },
  components: {
    home
  }
}
</script>

<style scoped lang="stylus">

</style>
