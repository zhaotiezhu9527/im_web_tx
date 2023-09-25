<template>
  <div class="app">
    <div class="search">
      <div class="button">
        <i class="iconfont icon-icon-test12 mr-1"></i>
        搜索好友
      </div>
      <div class="add" @click="addFriendRef.open()">+</div>
    </div>
    <div class="flex items-center rows">
      <div class="menu">
        <div class="row">
          <a-avatar
            :src="infos.avatar"
            :size="35"
            @click="userConRef.open()"
            class="cursor-pointer"
          />
          <a-badge :count="items.message" class="my-5">
            <i
              class="iconfont icon-huihua"
              :class="{ active: path === '/' }"
              @click="router.push('/')"
            ></i>
            <div class="txt" @click="router.push('/')" :class="{ active: path === '/' }">会话</div>
          </a-badge>
          <a-badge :count="items.count" class="flex flex-col items-center">
            <i
              class="iconfont icon-tongxunlu"
              :class="{ active: path === '/friend' }"
              @click="router.push('/friend')"
            ></i>
            <div
              class="txt"
              @click="router.push('/friend')"
              :class="{ active: path === '/friend' }"
            >
              通讯录
            </div>
          </a-badge>
        </div>
        <a-tooltip placement="right" arrow-point-at-center color="#ffffff">
          <template #title>
            <div class="views">
              <div class="item" @click="pass">修改密码</div>
              <div class="item" @click="logout">退出登录</div>
            </div>
          </template>
          <i class="iconfont icon-liebiaotuozhan02"></i>
        </a-tooltip>
      </div>
      <router-view />
    </div>
    <pwd ref="pwdRef" />
    <userCon ref="userConRef" />
    <addFriend ref="addFriendRef" />
  </div>
</template>
<script setup>
import Cookies from 'js-cookie'
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import pwd from '@/components/pwd.vue'
import userCon from '@/components/userCon.vue'
import addFriend from '@/components/addFriend.vue'
const items = ref({
  message: 0, //会话未读总数
  count: 0 // 好友申请未读数量
})
const userConRef = ref({})
const addFriendRef = ref({})
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
    window.$chat.destroy()
  })
}
const pwdRef = ref({})
function pass() {
  pwdRef.value.open()
}
const infos = ref({})
// 获取个人信息
window.$chat.getMyProfile().then(({ data }) => {
  infos.value = data
})
watch(
  () => window.$msgCount,
  (newVal) => {
    items.value.message = newVal
  },
  {
    deep: true,
    immediate: true
  }
)
const route = useRoute()
const path = ref('')
watch(
  () => route,
  (newVal) => {
    path.value = newVal.path
    console.log(newVal.path)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
<style scoped lang="scss">
.search {
  height: 60px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  .button {
    width: 50%;
    padding: 8px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #b3b7bc;
    background: #f1f5f8;
    cursor: pointer;
  }
  .add {
    width: 32px;
    height: 32px;
    line-height: 28px;
    color: #b3b7bc;
    background: #f1f5f8;
    border-radius: 4px;
    margin-left: 20px;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    justify-content: center;
  }
}
.rows {
  height: calc(100% - 60px);
}
.menu {
  width: 60px;
  height: 100%;
  display: flex;
  padding: 20px 0;
  border-right: 1px solid #e8e8e8;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .row {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666666;
  }
  .iconfont {
    font-size: 18px;
    color: #666666;
    cursor: pointer;
    &.active {
      color: #0052d9;
    }
  }
  div {
    text-align: center;
  }
  .txt {
    padding-top: 6px;
    font-size: 12px;
    color: #666666;
    cursor: pointer;
    &.active {
      color: #0052d9;
    }
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
.icon-liebiaotuozhan02 {
  font-size: 12px !important;
}
</style>
