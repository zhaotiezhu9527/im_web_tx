<template>
  <div>
    <a-modal
      v-model:open="show"
      title="修改密码"
      :mask="false"
      centered
      @cancel="cancel"
      style="width: 352px"
    >
      <template #title> </template>
      <div class="views">
        <div class="login-box pt-3">
          <a-form layout="horizontal" :model="form" :label-col="{ style: { width: '80px' } }">
            <a-form-item label="新密码：">
              <a-input-password
                size="middle"
                v-model:value="form.oldPwd"
                placeholder="请输入新密码"
              />
            </a-form-item>
            <a-form-item label="旧密码：">
              <a-input-password
                size="middle"
                v-model:value="form.newPwd"
                placeholder="请输入旧密码"
              />
            </a-form-item>
            <a-form-item label="确认密码：">
              <a-input-password
                size="middle"
                v-model:value="form.newPassword"
                placeholder="请输入确认密码"
              />
            </a-form-item>
            <a-form-item class="pt-3">
              <a-button class="button" size="middle" block type="primary" @click="userLogin">
                提交
              </a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <template #footer> </template>
    </a-modal>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { ref } from 'vue'
// 添加好友
const show = ref(false)
const router = useRouter()
const form = ref({
  oldPwd: '',
  newPassword: '',
  newPwd: ''
})
const items = ref('')
function open(val) {
  items.value = val
  show.value = true
}
function cancel() {
  form.value = {
    name: '',
    textarea: ''
  }
}
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

      window.$chat.destroy()
      window.$message.success('修改成功!')
    })
}

defineExpose({ open })
</script>
<style lang="scss" scoped>
.button {
  border-radius: 0 !important;
}
</style>
