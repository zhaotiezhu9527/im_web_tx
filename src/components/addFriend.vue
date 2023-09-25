<template>
  <div>
    <a-modal
      v-model:open="show"
      style="width: 460px"
      title="添加好友"
      centered
      @cancel="cancel"
      :mask="false"
    >
      <div class="pt-3">
        <a-input class="input" v-model:value="search" placeholder="请输入账号" />
      </div>
      <div
        v-for="(item, index) in list"
        :key="index"
        class="flex items-center justify-between item pt-2"
      >
        <div class="flex items-center">
          <a-avatar shape="square" :src="item.avatar" :size="40" />
          <div class="pl-2 text-14px">{{ item.nick }}</div>
        </div>
        <a-button
          class="button"
          type="primary"
          style="background: #2ba245"
          size="small"
          @click="routePage(item)"
        >
          添加
        </a-button>
      </div>
      <template #footer>
        <div class="pt-20px">
          <a-button class="button" size="middle" @click="cancel"> 取消 </a-button>
          <a-button class="button" size="middle" type="primary" @click="sbumit"> 提交 </a-button>
        </div>
      </template>
    </a-modal>
    <userCon ref="userConRef" />
    <addCon ref="addConRef" />
  </div>
</template>
<script setup>
import Cookies from 'js-cookie'
import { ref } from 'vue'
import userCon from '@/components/userCon.vue'
import addCon from '@/components/addCon.vue'
// 添加好友
const show = ref(false)
const list = ref([])
const search = ref('')
function open() {
  show.value = true
}
function cancel() {
  search.value = ''
  show.value = false
}
const userConRef = ref({})
const addConRef = ref({})
function sbumit() {
  if (!search.value) {
    window.$message.error('请输入账号')
  } else if (Cookies.get('userID') === search.value) {
    userConRef.value.open()
  } else {
    dataFn()
  }
}
function dataFn() {
  window.$chat
    .getUserProfile({ userIDList: [search.value] })
    .then(({ data }) => {
      list.value = data
      // infoscnRef.value.open(infos.value)
    })
    .catch((imError) => {
      window.$message.error(imError.message)
    })
}
function routePage(item) {
  addConRef.value.open(item)
}
defineExpose({ open })
</script>
<style lang="scss" scoped>
.button {
  border-radius: 0 !important;
}
</style>
