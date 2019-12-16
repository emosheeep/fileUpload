<template>
    <div>
      <van-nav-bar title="添加小组" left-arrow
                   @click-left="$router.push({name: 'home'})"
                   @click-right="addGroup">
        <van-icon name="plus" slot="right" />
      </van-nav-bar>
      <van-panel title="我的分组：" :desc="description">
        <group-list
          :list.sync="groupList"
          @edit="onEdit"
          @del="onDelete"
        />
      </van-panel>
      <van-popup v-model="showGroupEdit" position="bottom" round>
        <group-edit
          :type="type"
          :group="editingGroup"
          @save="onSave"
          @del="onDelete"
        />
      </van-popup>
    </div>
</template>

<script>
import GroupList from './groupList'
import GroupEdit from './groupEdit'
import mutationTypes from '../../store/mutation-types'
import {updateContact} from '../../api/api'
export default {
  name: 'index',
  components: {GroupList, GroupEdit},
  data () {
    return {
      description: '点击右上方加号，添加常用联系人组',
      // 联系人小组
      showGroupEdit: false,
      editingGroup: {},
      chosenGroupId: null,
      groupList: []
    }
  },
  computed: {
    type () {
      return this.chosenGroupId !== null ? 'edit' : 'add'
    }
  },
  watch: {
    groupList: {
      async handler (newVal, oldValue) {
        if (newVal.length === 0) {
          this.description = '点击加号，添加常用联系人组'
        } else {
          this.description = '点击小组添加成员，右滑查看更多选项'
        }
        if (oldValue.length === 0) {
          return // 跳过第一次
        }
        let options = {
          condition: { phone: this.$store.state.phone },
          data: {
            contact: newVal
          }
        }
        // actions提交联系人状态,本地和服务器都要编辑
        this.$toast.loading({
          loadingType: 'spinner',
          duration: 0,
          message: '请稍后',
          forbidClick: true
        })
        try {
          let result = await updateContact(options)
          if (result.status) {
            this.$store.commit(mutationTypes.SET_CONTACT, newVal)
          }
        } catch (e) {
          console.error(e)
          this.$toast.fail('同步失败')
        } finally {
          this.$toast.clear() // 停止加载
        }
      },
      deep: true
    }
  },
  methods: {
    addGroup () {
      this.showGroupEdit = true
      this.chosenGroupId = null
      this.editingGroup = { // 相当于新建用户
        id: Date.now(),
        name: '',
        userList: []
      }
    },
    // 编辑小组信息
    onEdit (group) {
      this.showGroupEdit = true
      this.chosenGroupId = group.id
      this.editingGroup = group
    },
    // 保存小组
    onSave (group) {
      this.showGroupEdit = false
      if (this.type === 'edit') {
        this.groupList = this.groupList.map(item => item.id === group.id ? group : item)
      } else {
        this.groupList.push(group)
      }
    },
    // 删除小组
    onDelete (group) {
      this.$dialog.confirm({
        title: '警告',
        message: '确定删除？'
      }).then(() => {
        this.showGroupEdit = false
        this.groupList = this.groupList.filter(item => item.id !== group.id)
      }).catch(e => e)
    }
  },
  mounted () {
    this.groupList = this.$store.state.contact
  }
}
</script>

<style scoped lang="stylus">

</style>
