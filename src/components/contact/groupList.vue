<template>
    <div>
      <van-sticky>
        <van-nav-bar title="添加小组" left-arrow
                     @click-left="$router.push({name: 'home'})"
                     @click-right="addGroup">
          <van-icon name="plus" slot="right" />
        </van-nav-bar>
      </van-sticky>
      <van-panel title="我的分组：" :desc="description">
        <group-list
          :list="contact"
          @edit="onEdit"
          @del="onDelete"
        />
      </van-panel>
<!--      隐藏弹层，编辑信息-->
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
import { Sticky, Panel, Popup } from 'vant'
import GroupList from './groupItem'
import GroupEdit from './groupEdit'
import mutationTypes from '../../store/mutation-types'
import { mapState } from 'vuex'
export default {
  name: 'index',
  components: {
    'van-sticky': Sticky,
    'van-panel': Panel,
    'van-popup': Popup,
    GroupList,
    GroupEdit
  },
  data () {
    return {
      // 联系人小组
      showGroupEdit: false,
      editingGroup: {},
      chosenGroupId: null
    }
  },
  computed: {
    ...mapState({
      contact: state => state.contact
    }),
    type () {
      return this.chosenGroupId !== null ? 'edit' : 'add'
    },
    // 一些描述
    description () {
      if (this.contact.length === 0) {
        return '点击加号，添加常用联系人组'
      } else {
        return '点击小组添加成员，右滑查看更多选项'
      }
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
      let contact = [] // 存放变化后的全部联系人信息
      if (this.type === 'edit') {
        contact = this.contact.map(item => item.id === group.id ? group : item)
      } else {
        contact = this.contact.slice(0)
        contact.push(group)
      }
      this.saveToState(contact)
    },
    // 删除小组
    onDelete (group) {
      this.$dialog.confirm({
        title: '警告',
        message: '确定删除？'
      }).then(() => {
        this.showGroupEdit = false
        let contact = this.contact.filter(item => item.id !== group.id)
        console.log(contact)
        this.saveToState(contact)
      }).catch(e => e)
    },
    // 将改变后的该分组信息映射到vuex中
    saveToState (contact) {
      // 先更新服务器数据,再更新本地
      this.$store.dispatch(mutationTypes.SET_CONTACT, {
        contact,
        toast: this.$toast
      })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
