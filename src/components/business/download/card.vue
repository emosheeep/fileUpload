<template>
  <div id="card"
       ref="card"
       @click.capture="bounce">
    <van-image
      class="img"
      fit="cover"
      lazy-load
      v-lazy="img.src"
      :src="img.src"
      @click="preview(img.src)"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
      <template v-slot:error>加载失败</template>
    </van-image>
    <div class="info">
      <div class="van-ellipsis">姓名：{{img.username}}</div>
      <div class="van-ellipsis">学号：{{img.studentID}}</div>
      <div class="van-ellipsis">时间：{{new Date(img.time).toLocaleDateString()}}</div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
  name: 'card',
  props: {
    img: { required: true }
  },
  methods: {
    preview (src) {
      ImagePreview({
        images: [src],
        showIndex: false
      })
    },
    bounce (e) {
      this.$animationCSS(e.currentTarget, 'shake')
    }
  }
}
</script>

<style scoped lang="stylus">
#card
  /*修改宽度要记得修改占位div的宽度*/
  width 40%
  height 170px
  margin 10px
  border-radius 5px
  border 1px solid lightgrey
  box-sizing border-box
  box-shadow 0 0 10px 2px lightgrey
  overflow hidden
  .img
    width 100%
    height 100px
  .info
    padding 0 5px
</style>
