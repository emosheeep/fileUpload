<template>
    <div>
      <!--背景图片-->
      <div class="background">
        <van-image
          cover
          class="background-img"
          :src="background"
          @click="backgroundPanelShow = true"
        >
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
          <template v-slot:error>加载失败</template>
        </van-image>
      </div>
      <div class="info-panel">
        <!--头像模块-->
        <div class="avatar">
          <van-image
            cover
            round
            :src="avatar"
            @click="avatarPanelShow = true"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error>加载失败</template>
          </van-image>
        </div>
        <div class="words">
          {{username}}&nbsp;/&nbsp;{{university.name}}
        </div>
        <!--修改头像-->
        <van-popup
          style="height: 75%"
          position="bottom"
          v-model="avatarPanelShow"
        >
          <van-cell
            center
            title="头像列表"
            size="large"
            label="选择你喜欢的头像吧"
          />
          <div class="all-avatar">
            <van-image
              class="avatar-img"
              round
              v-for="(item, index) in allAvatar"
              :key="index"
              :src="item.src"
              @click="changeAvatar($event, item.filename)"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template v-slot:error>加载失败</template>
            </van-image>
            <!--弹性布局占位用-->
            <div
              v-if="allAvatar.length % 2 !== 0"
              class="avatar-img"
              style="visibility: hidden"
            />
          </div>
        </van-popup>
      </div>
      <!--业务模块-->
      <div class="business">
        <van-cell-group>
          <van-cell
            is-link
            icon="todo-list-o"
            size="large"
            title="提交截图"
            to="/todoList"
          />
          <van-cell
            is-link
            icon="plus"
            size="large"
            title="发布任务"
            to="/task/list"
          />
          <van-cell
            is-link
            icon="down"
            size="large"
            title="文件下载"
            to="/files"
          />
        </van-cell-group>
        <van-cell-group title="更多">
          <van-cell
            is-link
            icon="contact"
            size="large"
            title="常用联系人"
            to="/contact/groups"
          />
          <van-cell
            is-link
            icon="setting-o"
            size="large"
            title="设置"
            to="/info"
          />
        </van-cell-group>
      </div>
      <!--修改背景-->
      <van-popup
        style="height: 100%; width: 50%"
        position="left"
        v-model="backgroundPanelShow"
      >
        <van-cell
          center
          title="背景列表"
          size="large"
          label="选择一张背景图"
        />
        <div class="all-background">
          <van-image
            class="avatar-img"
            v-for="(item, index) in allBackground"
            :key="index"
            :src="item.src"
            @click="changeBackground($event, item.filename)"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
            <template v-slot:error>加载失败</template>
          </van-image>
        </div>
      </van-popup>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { client } from '../../api/upyun.js'
import type from '../../store/mutation-types.js'
export default {
  name: 'home',
  data () {
    return {
      avatarPanelShow: false,
      backgroundPanelShow: false,
      allAvatar: [],
      allBackground: []
    }
  },
  computed: mapState({
    username: 'username',
    university: 'university',
    domain: 'domain',
    avatar: state => `${state.domain}/avatar/${state.avatar}`,
    background: state => `${state.domain}/background/${state.background}`
  }),
  methods: {
    getPictures () {
      Promise.all([
        client.listDir('/avatar'),
        client.listDir('/background')
      ]).then(([avatars, backgrounds]) => {
        this.allAvatar = avatars.files.map(file => {
          return {
            filename: file.name,
            src: `${this.domain}/avatar/${file.name}`
          }
        })
        this.allBackground = backgrounds.files.map(file => {
          return {
            filename: file.name,
            src: `${this.domain}/background/${file.name}`
          }
        })
      })
    },
    changeAvatar (e, filename) {
      this.$animationCSS(e.target, 'bounce', () => {
        this.avatarPanelShow = false
        this.loading({
          loadingType: 'spinner',
          duration: 0,
          message: '请稍后',
          forbidClick: true
        })
        this.$store.dispatch(type.SET_AVATAR, filename).then(() => {
          this.$toast.clear()
        }).catch(() => {
          this.$toast.fail('更换失败')
        })
      })
    },
    changeBackground (e, filename) {
      this.$animationCSS(e.target, 'bounce', () => {
        this.backgroundPanelShow = false
        this.loading({
          loadingType: 'spinner',
          duration: 0,
          message: '请稍后',
          forbidClick: true
        })
        this.$store.dispatch(type.SET_BACKGROUND, filename).then(() => {
          this.$toast.clear()
        }).catch(() => {
          this.$toast.fail('更换失败')
        })
      })
    }
  },
  mounted () {
    this.getPictures()
  }
}
</script>

<style scoped lang="stylus">
.background
  position fixed
  top 0
  z-index -10
  .background-img
    width 100%
    height 250px
.info-panel
  $radius = 100px
  position relative
  top 1px
  height 100px
  margin-top 150px
  background linear-gradient(
    to top,
    rgba(255, 255, 255, 1),
    rgba(255, 255, 255, 0)
  )
  .avatar
    position absolute
    z-index 10
    width $radius
    height $radius
    left 50%
    transform translate(-50%, - $radius/2)
    border 4px white solid
    border-radius $radius
  .words
    padding-top 60px
    padding-bottom 10px
    text-align center
    font-size 20px
.all-avatar
  display flex
  flex-wrap wrap
  justify-content space-around
  .avatar-img
    width 40%
    margin 10px
    border 1px lightgrey solid
    box-shadow 0 0 10px lightgrey
.business
  height calc(100vh - 250px)
  padding-top 20px
  background-color white
  font-size 20px !important
</style>
