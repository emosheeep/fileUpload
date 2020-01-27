<template>
    <div>
      <router-view/>
      <Tabbar v-model="active">
        <TabbarItem icon="search" :to="{name: 'explore'}">探索</TabbarItem>
        <TabbarItem icon="setting-o" :to="{name: 'home'}">主页</TabbarItem>
      </Tabbar>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
export default {
  name: 'index',
  components: { Tabbar, TabbarItem },
  data () {
    return {
      active: 1
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
