<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    // 判断本地信息是否还存在
    if (!this.$store.getters.loginState) {
      // 在login页面刷新会提示已经在当前页面，使用catch吃掉这个错误即可
      this.$router.push({name: 'login'}).catch(e => e)
      this.$cookie.remove('user')
    }
  }
}
</script>

<style>
  html, body, #app {
    height: 100%;
  }
</style>
