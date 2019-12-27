<template>
    <div>
      <van-nav-bar
        title="预览"
        right-text="全部下载"
        left-arrow
        @click-left="$router.go(-1)"
        @click-right="createLink"
      />
      <van-pull-refresh
        v-model="isLoading"
        @refresh="getFileList"
        style="overflow: visible"
      >
        <div style="height: 500px">
          <van-grid :column-num="3">
            <van-grid-item
              v-for="(item, index) in images"
              :key="index"
              class="image-box"
            >
              <van-image
                width="6rem"
                height="6rem"
                lazy-load
                v-lazy="item.src"
                fit="scale-down"
                :src="item.src"
                @click="preview(item.src)"
              >
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
                <template v-slot:error>加载失败</template>
              </van-image>
              <div class="info">
                <div class="van-ellipsis">{{item.username}}</div>
                <div class="van-ellipsis">{{item.studentID}}</div>
                <div class="van-ellipsis">{{new Date(item.time).toLocaleDateString()}}</div>
              </div>
            </van-grid-item>
          </van-grid>
        </div>
      </van-pull-refresh>
    </div>
</template>

<script>
import Vue from 'vue'
import {ImagePreview, Lazyload} from 'vant'
import upyun from '../../../api/upyun'
import {mapState} from 'vuex'
import {Base64} from 'js-base64'
import {compress} from '../../../api/api'
Vue.use(Lazyload)
export default {
  name: 'preview',
  props: {
    title: String
  },
  data () {
    return {
      isLoading: true,
      images: []
    }
  },
  computed: {
    ...mapState({
      phone: 'phone',
      domain: 'domain'
    }),
    path () {
      return `/upload/${this.phone}/${this.title}`
    }
  },
  methods: {
    getFileList () {
      upyun.listDir(this.path).then(res => {
        if (res) {
          this.images = res.files.map(item => {
            let filename = item.name
            let studentID = filename.split('-')[0]
            let username = filename.match(/-(.*?)\./)[1] // 文件名中匹配姓名
            return {
              studentID: studentID,
              username: username,
              src: `${this.domain}${this.path}/${item.name}`,
              time: item.time * 1000 // 平台传回的是10位时间戳，需转换为13位才能被正确识别
            }
          })
        }
      }).catch(e => {
        console.error(e.message)
      }).finally(() => {
        this.isLoading = false
        if (!navigator.onLine) {
          this.$toast.fail('网络错误')
        }
      })
    },
    preview (src) {
      ImagePreview({
        images: [src],
        showIndex: false
      })
    },
    async upyunCompress () {
      let path = this.path
      let tasks = [{
        sources: [`${path}/`], // 压缩目录下所有文件
        save_as: `${path}.zip`, // 保存位置
        home_dir: `${path}` // 压缩时不包含的目录
      }]
      tasks = Base64.encode(JSON.stringify(tasks))
      try {
        let data = await compress(tasks)
        console.log('压缩任务提交成功，任务id:' + data)
      } catch (e) {
        console.error(e)
      }
    },
    // 创建链接开始下载
    createLink () {
      this.$toast.loading({
        message: '正在压缩...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      let path = `${this.path}.zip`
      upyun.headFile(path).then(data => {
        if (data) { // 存在文件则创建超链接并下载
          this.$toast.clear() // 加载结束
          let a = document.createElement('a')
          a.style.display = 'none'
          a.href = this.domain + path
          document.body.append(a)
          a.click()
          a.remove() // 点击后移除并且释放内存
          a = null
        } else {
          // 否则稍后重新尝试
          console.warn('正在压缩，请稍后')
          setTimeout(this.createLink, 1000)
        }
      }).catch(e => e)
    }
  },
  created () {
    this.getFileList() // 获取文件列表
    this.upyunCompress() // 压缩对应文件夹
  },
  destroyed () {
    upyun.deleteFile(`${this.path}.zip`).then(res => {
      console.log('删除状态：', res)
    }).catch(e => {
      console.log('文件不存在，无需删除')
    })
  }
}
</script>

<style scoped lang="stylus">
.image-box
  width 33.33%
.info
  text-align left
</style>