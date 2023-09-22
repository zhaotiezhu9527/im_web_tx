<template>
  <div class="views">
    <div class="login-box">
      <div class="title">修改密码</div>
      <a-form layout="vertical" :model="form">
        <a-form-item label="新密码：">
          <a-input-password size="large" v-model:value="form.oldPwd" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item label="旧密码：">
          <a-input-password size="large" v-model:value="form.newPwd" placeholder="请输入旧密码" />
        </a-form-item>
        <a-form-item label="确认密码：">
          <a-input-password
            size="large"
            v-model:value="form.newPassword"
            placeholder="请输入确认密码"
          />
        </a-form-item>
        <a-form-item class="pt-10">
          <a-button class="button" size="large" block type="primary" @click="userLogin">
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { ref } from 'vue'

const router = useRouter()
const form = ref({
  oldPwd: '',
  newPassword: '',
  newPwd: ''
})
function userLogin() {
  if (!form.value.oldPwd) {
    window.$message.info('请输入旧密码')
    return false
  } else if (!form.value.newPwd) {
    window.$message.info('请输入新密码')
    return false
  } else if (form.value.newPassword !== form.value.newPwd) {
    window.$message.info('密码不一致')
    return false
  }
  window.$api
    .user_update_pwd({
      newPwd: form.value.newPwd,
      oldPwd: form.value.oldPwd
    })
    .then(() => {
      Cookies.remove('token')
      Cookies.remove('userID')
      Cookies.remove('usersig')
      router.push('/login')
      window.$message.success('修改成功!')
    })
}
</script>
<style lang="scss" scoped>
.home-TUIKit-main {
  display: flex;
  height: 100%;
}
.views {
  flex: 1;
  height: 100%;
  .login-box {
    padding: 100px 300px;
  }
  .title {
    font-size: 25px;
    font-weight: 600;
    padding-bottom: 40px;
  }
}
</style>
