<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import type from './store/mutation-types'
export default {
  name: 'App',
  mounted () {
    this.$store.dispatch(type.SET_UNIVERSITY)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
