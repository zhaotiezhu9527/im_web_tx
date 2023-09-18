<template>
  <div class="menu">
    <div class="row">
      <i class="iconfont icon-icon-test3"></i>
      <i class="iconfont icon-icon-test35"></i>
      <i class="iconfont icon-icon-test37"></i>
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
</template>
<script setup>
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

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
        console.warn('logout error:', imError)
      })
    router.push('/login')
  })
}
function pass() {
  router.push('/password')
}
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
    .iconfont {
      margin-top: 20px;
    }
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
  }
}
</style>
