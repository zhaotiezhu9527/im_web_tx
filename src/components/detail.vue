<template>
  <div v-if="items" class="rows">
    <div class="flex items-center pb-4 border-bottom">
      <a-avatar :size="70" :src="items.avatar" />
      <div class="content pl-2">
        <div class="text-14px pb-2">昵称：{{ items.nick }}</div>
        <div class="text-14px">账号：{{ items.userID }}</div>
      </div>
    </div>
    <div class="list">
      <div class="item">
        <span>备注：</span>
        <div class="flex">
          <a-input class="mr-2" v-model:value="form.remark" placeholder="请输入备注" />
        </div>
      </div>
      <div class="item">
        <span>性别：</span>
        <div>{{ genderFn() }}</div>
      </div>
      <div class="item">
        <span>个性签名：</span>
        <div>{{ items.selfSignature }}</div>
      </div>
      <div class="item">
        <span>留言：</span>
        <div>{{ infos.wording }}</div>
      </div>
      <div class="btn flex flex-col">
        <a-button
          class="my-3"
          type="primary"
          @click="service"
          v-if="infos.type === 'Pendency_Type_ComeIn'"
        >
          同意
        </a-button>
        <a-button @click="blackChange" v-if="infos.type === 'Pendency_Type_ComeIn'">
          拒绝
        </a-button>
        <a-button
          class="my-3"
          type="text"
          color="red"
          @click="delChange"
          v-if="infos.type === 'Pendency_Type_ComeIn'"
        >
          删除申请
        </a-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const items = ref('')
const infos = ref({})
const form = ref({
  remark: '' // 备注
})
function open(val) {
  infos.value = val
  window.$chat
    .getUserProfile({
      userIDList: [val.userID]
    })
    .then(({ data }) => {
      items.value = data[0]
    })
  window.$chat.setFriendApplicationRead().then(() => {
    //已读上报成功
  })
}
function genderFn() {
  let name = ''
  switch (this.items.gender) {
    case 'Gender_Type_Male':
      name = '男'
      break
    case 'Gender_Type_Female':
      name = '女'
      break
    default:
      name = ''
      break
  }
  return name
}
const emit = defineEmits('ok')
function service() {
  window.$chat
    .acceptFriendApplication({
      userID: items.value.userID,
      remark: form.value.remark,
      type: items.value.type
    })
    .then(() => {
      window.$message.success('添加成功')
      items.value = ''
      emit('ok', 'add')
    })
}
function blackChange() {
  window.$chat
    .refuseFriendApplication({
      userID: items.value.userID
    })
    .then(() => {
      window.$message.success('拒绝成功')
      items.value = ''
      emit('ok', 'error')
    })
}
function delChange() {
  window.$chat
    .deleteFriendApplication({
      userID: items.value.userID,
      type: items.value.type
    })
    .then(() => {
      window.$message.success('删除成功')
      items.value = ''
      emit('ok', 'del')
    })
}
defineExpose({ open })
</script>
<style lang="scss" scoped>
.rows {
  width: 400px;
  padding: 40px;
  .border-bottom {
    border-bottom: 1px solid #eee;
  }
}
.list {
  padding-top: 20px;
  .item {
    font-size: 14px;
    line-height: 32px;
    display: flex;
    align-items: center;
    color: #666;
    span {
      width: 80px;
    }
  }
}
</style>
