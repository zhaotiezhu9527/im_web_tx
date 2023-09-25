<template>
  <div>
    <a-modal
      v-model:open="show"
      style="width: 352px"
      title="添加好友"
      centered
      @cancel="cancel"
      :mask="false"
    >
      <template #title> </template>
      <a-form class="pt-4" layout="horizontal" :model="items">
        <a-form-item label="备注：">
          <a-input class="input" v-model:value="form.name" placeholder="请输入备注" />
        </a-form-item>
        <a-form-item label="留言：">
          <a-textarea
            class="input"
            v-model:value="form.textarea"
            placeholder="请输入留言"
            :rows="4"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <div class="pb-20px">
          <a-button class="button" size="middle" @click="cancel"> 取消 </a-button>
          <a-button class="button" size="middle" type="primary" @click="sbumit"> 提交 </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script setup>
import { ref } from 'vue'
// 添加好友
const show = ref(false)
const form = ref({
  name: '',
  textarea: ''
})
const items = ref('')
const emit = defineEmits(['ok'])
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
function sbumit() {
  let is_ok = window.$tx.TYPES.ALLOW_TYPE_ALLOW_ANY === items.value.allowType
  // is_ok 为真则为双向添加，否则单向添加
  window.$chat
    .addFriend({
      to: items.value.userID,
      source: 'AddSource_Type_Web',
      remark: form.value.name,
      groupName: '好友',
      wording: form.value.textarea,
      type: is_ok ? window.$tx.TYPES.SNS_ADD_TYPE_BOTH : window.$tx.TYPES.SNS_ADD_TYPE_SINGLE // 单向添加
    })
    .then((imResponse) => {
      // 添加好友的请求发送成功
      const { code } = imResponse.data
      if (code === 30539) {
        window.$message.success('提交成功，等待对方验证！')
      } else if (code === 0) {
        window.$message.success('添加好友成功！')
      }
      emit('ok')
      cancel()
    })
    .catch((error) => {
      window.$message.error(error.message)
    })
  // 关闭添加好友对话框
  function cancel() {
    form.value.name = ''
    form.value.textarea = ''
    show.value = false
  }
}
defineExpose({ open })
</script>
<style lang="scss" scoped>
.button {
  border-radius: 0 !important;
}
</style>
