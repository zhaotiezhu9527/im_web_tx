import { defineStore } from 'pinia'

export const useToken = defineStore('token', {
  state: () => {
    return {
      token: '',
      usersig: '',
      count: 0, // 消息未读
      unreadCount: 0, // 好友申请
      remark: ''
    }
  },
  actions: {
    setRemark(data) {
      this.remark = data
    },
    setToken(data) {
      this.token = data
    },
    setUsersig(data) {
      this.usersig = data
    }
  }
})
