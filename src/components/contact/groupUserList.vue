<template>
    <div>
      <van-sticky>
        <van-nav-bar title="添加成员" left-arrow
                     @click-right="addUser"
                     @click-left="$router.go(-1)">
          <van-icon name="plus" slot="right" />
        </van-nav-bar>
      </van-sticky>
<!--      显示联系人信息-->
      <van-panel :title="title" desc="点击右上角添加成员"
                 :status="`共${userList.length}人`">
        <user-list
          :list="userList"
          @edit="onEdit"
          @del="onDelete"
        />
      </van-panel>
<!--      编辑联系人信息-->
      <van-popup v-model="showUserEdit" position="bottom" round>
        <user-edit
          :group-name="title"
          :type="type"
          :user="editingUser"
          @save="onSave"
          @del="onDelete"
        />
      </van-popup>
    </div>
</template>

<script>
import UserEdit from './userEdit'
import UserList from './userList'
import {mapState} from 'vuex'
import type from '../../store/mutation-types'
export default {
  name: 'groupUserList',
  components: {UserList, UserEdit},
  props: {
    title: String
  },
  data () {
    return {
      showUserEdit: false,
      chosenUserId: null,
      editingUser: {}
    }
  },
  computed: {
    ...mapState({
      contact: state => state.contact,
      phone: state => state.phone,
      group (state) {
        return state.contact.find(item => this.title === item.name)
      }
    }),
    // 决定子组件功能
    type () {
      return this.chosenUserId !== null ? 'edit' : 'add'
    },
    userList () {
      return this.group.userList
    }
  },
  methods: {
    addUser () {
      this.showUserEdit = true
      this.chosenUserId = null
      this.editingUser = {
        id: Date.now(),
        username: '',
        studentID: ''
      }
    },
    // 编辑联系人
    onEdit (user) {
      this.showUserEdit = true
      this.chosenUserId = user.id
      this.editingUser = user
    },
    // 保存联系人
    onSave (user) {
      this.showUserEdit = false
      let list = [] // 存放修改过,或新增的用户列表
      if (this.type === 'edit') {
        list = this.userList.map(item => item.id === user.id ? user : item)
      } else {
        list = this.userList.slice(0)
        list.push(user)
      }
      this.saveToState(list)
    },
    // 删除联系人
    onDelete (user) {
      this.showUserEdit = false
      // list为删减后的列表
      let list = this.userList.filter(item => item.id !== user.id)
      this.saveToState(list)
    },
    // 将改变后的该分组信息映射到vuex中
    saveToState (list) {
      // 构建小组信息
      let group = {
        id: this.group.id,
        name: this.group.name,
        userList: list
      }
      let contact = this.contact.slice(0)
      // 映射当前分组的信息变化
      contact = contact.map(item => item.id === group.id ? group : item)
      this.$store.dispatch(type.SET_CONTACT, {
        contact,
        toast: this.$toast
      })
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
