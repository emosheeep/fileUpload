<template>
    <div>
      <van-sticky>
        <van-nav-bar
          title="预览"
          right-text="全部下载"
          left-arrow
          @click-left="$router.go(-1)"
          @click-right="createLink"
        />
      </van-sticky>
      <van-pull-refresh
        v-model="isLoading"
        @refresh="getFileList"
        style="overflow: visible"
      >
        <div class="cards animated fadeInUp">
          <card
            v-for="(item, index) in images"
            :key="index"
            :img="item"
          />
          <div style="width: 40%; margin: 10px" v-if="images.length % 2 !== 0" />
        </div>
      </van-pull-refresh>
    </div>
</template>

<script>
import {
  Sticky,
  PullRefresh
} from 'vant'
import { client, compress } from '../../../api/upyun'
import { mapState } from 'vuex'
import Card from './card'
export default {
  name: 'preview',
  components: {
    Card,
    'van-sticky': Sticky,
    'van-pull-refresh': PullRefresh
  },
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
      this.$toast.loading({
        message: '获取数据中...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      client.listDir(this.path).then(res => {
        if (res) {
          this.images = res.files.map(item => {
            let filename = item.name
            let studentID = filename.split('-')[0]
            let username = filename.match(/-(.*?)\./)[1] // 文件名中匹配姓名
            return {
              studentID: studentID,
              username: username,
              // 增加一个query参数防止图片被浏览器缓存
              src: `${this.domain}${this.path}/${item.name}?time=${Date.now()}`,
              time: item.time * 1000 // 平台传回的是10位时间戳，需转换为13位才能被正确识别
            }
          })
        }
      }).catch(e => {
        console.error(e.message)
      }).finally(() => {
        this.isLoading = false
        this.$toast.clear()
        if (!navigator.onLine) {
          this.$toast.fail('网络错误')
        }
      })
    },
    upyunCompress () {
      let path = this.path
      compress([{
        sources: [`${path}/`], // 压缩目录下所有文件
        save_as: `${path}.zip`, // 保存位置
        home_dir: `${path}` // 压缩时不包含的目录
      }]).then(data => {
        console.log('压缩任务已提交：' + data)
      }).catch(e => {
        console.error(e)
      })
    },
    // 创建链接开始下载
    createLink () {
      this.$toast.loading({
        message: '正在压缩...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      let path = `${this.path}.zip`
      client.headFile(path).then(data => {
        if (data) { // 存在文件下载
          this.$toast.clear() // 加载结束
          let a = document.createElement('a')
          a.href = (this.domain + path) // 创建超链接,下载文件
          a.style.display = 'none'
          document.body.append(a)
          a.click()
          a.remove()
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
    client.deleteFile(`${this.path}.zip`).then(res => {
      console.log('删除状态：', res)
    }).catch(e => {
      console.warn(e)
    })
  }
}
</script>

<style scoped lang="stylus">
.cards
  display flex
  flex-wrap wrap
  justify-content space-around
  height calc(100vh - 50px)
  div:after
    content ""
    flex auto
</style>
