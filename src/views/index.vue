<template>
    <div>
      <router-view/>
      <van-tabbar v-model="active">
        <van-tabbar-item icon="search" :to="{name: 'explore'}">探索</van-tabbar-item>
        <van-tabbar-item icon="home-o" :to="{name: 'home'}">主页</van-tabbar-item>
      </van-tabbar>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
export default {
  name: 'index',
  components: {
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem
  },
  data () {
    return {
      active: 1
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
