<template>
  <div>
    <!-- 联系人小组-->
    <van-swipe-cell v-for="(item, index) in list" :key="index" :right-width="120">
      <van-cell is-link :title="item.name"
                @click="editUser(item)" />
      <template slot="right">
        <van-button square type="danger" text="删除" @click="removeGroup(item)"/>
        <van-button square type="primary" text="编辑" @click="editGroup(item)"/>
      </template>
    </van-swipe-cell>
<!--    显示小组用户信息-->
    <van-popup position="bottom"
               v-model="showGroupUserEdit"
               style="width: 100%; height: 100%">
      <group-user-list
        :groupUser="groupUser"
        :show.sync="showGroupUserEdit"
        :title="title"
        @update="onUpdate"
      />
    </van-popup>
  </div>
</template>

<script>
import UserList from './userList'
import UserEdit from './userEdit'
import GroupUserList from './groupUserList'
export default {
  name: 'groupList',
  props: {
    list: Array // 小组对象数组
  },
  data () {
    return {
      // 用户列表
      showGroupUserEdit: false,
      chosenUserId: null,
      groupUser: {}, // 小组对象中的用户
      title: '',
      showGroupEdit: false // 显示小组列表
    }
  },
  computed: {
    // 返回编辑后的小组信息
    groupInfo () {
      return {
        id: this.chosenUserId,
        name: this.title,
        userList: this.userList
      }
    },
    type () {
      return this.chosenUserId !== null ? 'edit' : 'add'
    }
  },
  methods: {
    editGroup (groupUser) {
      this.$emit('edit', groupUser) // 触发自定义事件
    },
    removeGroup (groupUser) {
      this.$emit('del', groupUser)
    },
    editUser (groupUser) {
      this.showGroupUserEdit = true
      this.title = groupUser.name
      this.groupUser = groupUser // 将用户信息传入组件
    },
    // 更新用户
    onUpdate (groupUser) {
      this.groupUser = groupUser // 更新组件状态
      // 更新请求继续向上传递
      let groupUsers = this.list.map((item) => {
        return item.id === groupUser.id ? groupUser : item
      })
      this.$emit('update:list', groupUsers)
    },
    // 保存用户
    onSave (user) {
      this.showGroupEdit = false
      this.chosenUserId = user.id
      if (this.type === 'edit') {
        this.userList = this.userList.map(item => item.id === user.id ? user : item)
      } else {
        this.userList.push(user)
      }
    },
    // 删除用户
    onDelete (user) {
      this.showGroupEdit = false
      this.chosenUserId = user.id
      this.userList = this.userList.filter(item => item.id !== user.id)
    }
  },
  components: {
    GroupUserList,
    UserEdit,
    UserList
  }
}
</script>

<style scoped lang="stylus">
>>> .van-swipe-cell__right
      display flex
</style>
