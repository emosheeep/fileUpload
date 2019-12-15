<template>
    <div>
      <van-nav-bar title="添加成员" left-arrow
                   @click-right="addUser"
                   @click-left="$emit('update:show', false)">
        <van-icon name="plus" slot="right" />
      </van-nav-bar>
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
export default {
  name: 'groupUserList',
  components: {UserList, UserEdit},
  props: {
    title: String,
    groupUser: Object,
    show: Boolean
  },
  data () {
    return {
      showUserEdit: false,
      chosenUserId: null,
      editingUser: {}
    }
  },
  computed: {
    type () {
      return this.chosenUserId !== null ? 'edit' : 'add'
    },
    userList: {
      get () {
        return this.groupUser.userList
      },
      set (newVal) { // newVal更新后的userList
        this.$emit('update', {
          id: this.groupUser.id,
          name: this.groupUser.name,
          userList: newVal
        })
      }
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
      if (this.type === 'edit') {
        this.userList = this.userList.map(item => item.id === user.id ? user : item)
      } else {
        let list = JSON.parse(JSON.stringify(this.userList))
        list.push(user)
        this.userList = list // 必须要用赋值操作才能触发setter
      }
    },
    // 删除联系人
    onDelete (user) {
      this.showUserEdit = false
      this.userList = this.userList.filter(item => item.id !== user.id)
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
