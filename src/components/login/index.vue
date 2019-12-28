<template>
    <div>
      <van-nav-bar title="青年大学习截图收集"/>
      <van-tabs v-model="active" color="black">
        <van-tab title="登陆"></van-tab>
        <van-tab title="注册"></van-tab>
      </van-tabs>
      <keep-alive>
        <components :is="container[active]"></components>
      </keep-alive>
    </div>
</template>

<script>
import login from './login'
export default {
  name: 'index',
  data () {
    return {
      active: 0,
      container: ['login', 'register']
    }
  },
  components: {
    login,
    'register': () => import('./register'),
    'phone': import('./phone')
  }
}
</script>

<style scoped lang="stylus">

</style>
