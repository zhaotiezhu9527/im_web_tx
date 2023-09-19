<template>
  <div class="app">
    <Menu />
    <div class="views">
      <div class="login-box flex flex-col items-center">
        <a-avatar :src="items.avatar" :size="70" />
        <p class="pt-1 text-14px">账号：{{ userID }}</p>
        <a-form layout="vertical" class="pt-10 w-100" :model="form">
          <a-form-item label="昵称：">
            <a-input size="large" v-model:value="items.nick" placeholder="请输入昵称" />
          </a-form-item>
          <a-form-item label="性别：">
            <a-select
              size="large"
              v-model:value="items.gender"
              placeholder="请选择性别"
              :options="optionsGender"
            />
          </a-form-item>
          <a-form-item label="验证方式：">
            <a-select
              size="large"
              v-model:value="items.allowType"
              placeholder="请选择验证方式"
              :options="optionsAllowType"
            />
          </a-form-item>
          <a-form-item label="个性签名：">
            <a-input
              size="large"
              v-model:value="items.selfSignature"
              placeholder="请输入个性签名"
            />
          </a-form-item>
          <a-form-item class="pt-10 w-50 my-0 mx-auto">
            <a-button class="button" size="large" block type="primary" @click="sbumit">
              提交
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Menu from '@/components/menu.vue'
import { ref, onMounted } from 'vue'
const items = ref({
  avatar: '',
  nick: '',
  gender: '',
  selfSignature: '',
  allowType: ''
})
const optionsGender = [
  {
    label: '男',
    value: window.$tx.TYPES.GENDER_MALE
  },
  {
    label: '女',
    value: window.$tx.TYPES.GENDER_FEMALE
  }
]
const optionsAllowType = [
  {
    label: '允许直接加为好友',
    value: window.$tx.TYPES.ALLOW_TYPE_ALLOW_ANY
  },
  {
    label: '需要验证',
    value: window.$tx.TYPES.ALLOW_TYPE_NEED_CONFIRM
  },
  {
    label: '拒绝',
    value: window.$tx.TYPES.ALLOW_TYPE_DENY_ANY
  }
]
const userID = ref('')
onMounted(() => {
  // 获取个人信息
  window.$chat.getMyProfile().then(({ data }) => {
    userID.value = data.userID
    Object.keys(items.value).forEach((key) => {
      items.value[key] = data[key]
    })
  })
})
// 修改个人信息
function sbumit() {
  window.$chat
    .updateMyProfile(items.value)
    .then(() => {
      window.$message.success('修改资料成功!')
    })
    .catch(function (err) {
      window.$message.error(err.message)
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
    padding-top: 100px;
  }
}
</style>
