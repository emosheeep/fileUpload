<template>
    <div>
      <router-view/>
      <van-tabbar v-model="active">
        <van-tabbar-item icon="search" :to="{name: 'explore'}">探索</van-tabbar-item>
        <van-tabbar-item icon="setting-o" :to="{name: 'home'}">主页</van-tabbar-item>
      </van-tabbar>
    </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      active: 1
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
