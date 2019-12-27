<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    // 判断登陆信息是否过期
    if (this.$store.state.token === '') {
      // 在login页面刷新会提示已经在当前页面，使用catch吃掉这个错误即可
      this.$router.push({name: 'login'}).catch(e => e)
    }
  }
}
</script>

<style>
  html, body, #app {
    height: 100%;
  }
</style>
