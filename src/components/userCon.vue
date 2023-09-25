<template>
  <a-modal class="modalInfo" v-model:open="show" centered :closable="false" :mask="false">
    <template #title>
      <div class="header">
        <div class="flex items-center border-bottom">
          <a-avatar :size="70" :src="items.avatar" />
          <div class="content pl-2">
            <div class="text-14px text-white">{{ items.nick }}</div>
          </div>
        </div>
      </div>
    </template>
    <div class="rows">
      <a-form layout="horizontal" :model="items" :label-col="{ style: { width: '60px' } }">
        <a-form-item label="账号：">
          <a-input size="middle" disabled v-model:value="userID" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item label="昵称：">
          <a-input size="middle" v-model:value="items.nick" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="性别：">
          <a-select
            size="middle"
            v-model:value="items.gender"
            placeholder="请选择性别"
            :options="optionsGender"
          />
        </a-form-item>
        <a-form-item label="签名：">
          <a-textarea size="middle" v-model:value="items.selfSignature" placeholder="请输入签名" />
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <div class="pb-20px pr-20px">
        <a-button class="button" size="middle" @click="show = false"> 取消 </a-button>
        <a-button class="button" size="middle" type="primary" @click="sbumit"> 提交 </a-button>
      </div>
    </template>
  </a-modal>
</template>
<script setup>
import { ref } from 'vue'
const show = ref(false)
const userID = ref('')
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
function open() {
  // 获取个人信息
  window.$chat.getMyProfile().then(({ data }) => {
    userID.value = data.userID
    Object.keys(items.value).forEach((key) => {
      items.value[key] = data[key]
    })
    show.value = true
  })
}
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
defineExpose({ open })
</script>
<style lang="scss" scoped>
.rows {
  padding: 20px;
  .border-bottom {
    border-bottom: 1px solid #eee;
  }
}
.list {
  .item {
    font-size: 14px;
    line-height: 32px;
    display: flex;
    align-items: center;
    color: #666;
    span {
      width: 60px;
    }
  }
}
.button {
  border-radius: 0 !important;
}
</style>
