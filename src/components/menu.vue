<template>
  <div class="app">
    <div class="menu">
      <div class="row">
        <a-badge :count="items.message">
          <i class="iconfont icon-icon-test3" @click="router.push('/')"></i>
        </a-badge>
        <i class="iconfont py-5 icon-icon-test35" @click="router.push('/user')"></i>
        <a-badge :count="items.count">
          <i class="iconfont icon-icon-test37" @click="router.push('/friend')"></i>
        </a-badge>
      </div>
      <a-tooltip placement="top" arrow-point-at-center color="#ffffff">
        <template #title>
          <div class="views">
            <div class="item" @click="pass">修改密码</div>
            <div class="item" @click="logout">退出登录</div>
          </div>
        </template>
        <i class="iconfont icon-icon-test16"></i>
      </a-tooltip>
    </div>
    <router-view />
  </div>
</template>
<script setup>
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
const items = ref({
  message: 0, //会话未读总数
  count: 0 // 好友申请未读数量
})

// 监听会话未读总数
window.$chat.on(window.$tx.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, ({ data }) => {
  items.value.message = data
  window.$msgCount = data
})
// 监听好友申请未读总数
window.$chat.on(window.$tx.EVENT.FRIEND_APPLICATION_LIST_UPDATED, (event) => {
  // unreadCount - 好友申请的未读数
  const { unreadCount } = event.data
  items.value.count = unreadCount
  window.$unreadCount = unreadCount
})
setTimeout(() => {
  items.value.message = window.$chat.getTotalUnreadMessageCount() || window.$msgCount
  items.value.count = window.$unreadCount
}, 500)
const router = useRouter()
function logout() {
  window.$api.get_logout().then(() => {
    Cookies.remove('token')
    Cookies.remove('userID')
    Cookies.remove('usersig')
    window.$message.success('退出成功')
    window.$chat
      .logout()
      .then(() => {})
      .catch(function (imError) {
        window.$message.error(imError.message)
      })
    router.push('/login')
  })
}
function pass() {
  router.push('/password')
}
watch(
  () => window.$msgCount,
  (newVal) => {
    console.log('....newVal')
    items.value.message = newVal
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
<style scoped lang="scss">
.menu {
  width: 55px;
  height: 100%;
  background-color: rgba(#0052d9, 1);
  display: flex;
  padding: 20px 0;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .row {
    display: flex;
    flex-direction: column;
  }
  .iconfont {
    font-size: 22px;
    color: #fff;
    cursor: pointer;
  }
}
.views {
  .item {
    color: #212112 !important;
    margin: 6px;
    font-size: 13px;
    letter-spacing: 1px;
    cursor: pointer;
    &:hover {
      color: #0052d9 !important;
    }
  }
}
</style>
