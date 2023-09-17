import { defineStore } from 'pinia'

// 获取表单次数，只请求一次
export const useToken = defineStore('token', {
  state: () => {
    return {
      token: ''
    }
  },
  actions: {
    setToken(data) {
      this.token = data
    }
  }
})
