<template>
  <div>
    <div class="filePicker">
      <van-uploader
        v-model="fileList"
        :max-count="1"
        preview-size="200px"
        upload-text="请选择图片"
        image-fit="scale-down"
      />
    </div>
    <div class="btn-group">
      <van-button
        type="primary"
        size="large"
        round
        :loading="loading"
        @click="upload"
      >
        上传文件
      </van-button>
    </div>
  </div>
</template>

<script>
import upyun from '../../../api/upyun'
import {mapState} from 'vuex'
export default {
  name: 'upload',
  props: {
    task: Object
  },
  data () {
    return {
      loading: false,
      fileList: []
    }
  },
  computed: {
    ...mapState({
      studentID: 'studentID',
      username: 'username'
    }),
    // 返回上传路径
    path () {
      let path = `/upload/${this.task.creator}/${this.task.title}`
      let typeStr = this.fileList[0].content.match(/:(.*?);/)[1]
      typeStr = typeStr.split('/')[1]
      let filename = `${this.studentID}-${this.username}`
      return `${path}/${filename}.${typeStr}`
    }
  },
  methods: {
    upload () {
      if (this.fileList.length === 0) {
        return this.$toast('请选择文件')
      }
      let {file} = this.fileList[0]
      this.loading = true
      upyun.putFile(this.path, file).then(res => {
        if (res) {
          this.$toast.success('成功')
          this.fileList = []
        }
      }).catch(e => {
        console.log(e)
        this.$toast.fail('系统错误')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  .filePicker
    text-align center
    margin 30px 0
  .btn-group
    margin 20px 0
    text-align center
</style>
