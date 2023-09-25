<template>
  <div>
    <a-modal
      v-model:open="show"
      class="searchModel"
      style="width: 630px"
      centered
      @cancel="cancel"
      :mask="false"
      :closable="false"
    >
      <template #title>
        <div class="pt-3 flex items-center header">
          <a-input
            class="input"
            v-model:value="search"
            @pressEnter="change"
            placeholder="请搜索好友"
          >
            <template #prefix> <i class="iconfont icon-icon-test12"></i> </template>
          </a-input>
          <i class="iconfont icon-cuowuguanbiquxiao ml-3"></i>
        </div>
      </template>
      <div class="content">
        <div class="title">好友</div>
        <div
          v-for="(item, index) in list"
          :key="index"
          class="flex items-center justify-between item pt-2"
          @click="routePage(item)"
        >
          <div class="flex items-center">
            <a-avatar shape="square" :src="item.profile.avatar" :size="40" />
            <div class="pl-2 text-14px" v-html="titleFn(item.remark || item.profile.nick)"></div>
          </div>
        </div>
      </div>
      <template #footer> </template>
    </a-modal>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// 添加好友
const show = ref(false)
const list = ref([])
const listAll = ref([])
const search = ref('')
function open() {
  show.value = true
}
function cancel() {
  search.value = ''
  show.value = false
}
function titleFn(e) {
  let title = e.replace(search.value, `<span class='green-c'>${search.value}</span>`)
  return title
}
function change() {
  let all = JSON.parse(JSON.stringify(listAll.value))
  list.value = all.filter(
    (item) => item?.profile?.nick.includes(search.value) || item?.remark.includes(search.value)
  )
}
dataFn()
function dataFn() {
  list.value = []
  listAll.value = []
  window.$chat.getFriendList().then(({ data }) => {
    list.value = data
    listAll.value = JSON.parse(JSON.stringify(list.value))
  })
}
function routePage(item) {
  router.push('/?c=' + item.userID)
  show.value = false
}
defineExpose({ open })
</script>
<style lang="scss" scoped>
.input,
.button {
  border-radius: 0 !important;
}
.item {
  width: 100%;
  padding: 6px 10px;
  cursor: pointer;
  &.active,
  &:hover {
    background-color: #ebf3fc;
  }
  &:nth-child(2) {
    .font-icon {
      background-color: #fa9d3b;
    }
  }
  &:nth-child(3) {
    .font-icon {
      background-color: #000;
    }
  }
  .font-icon {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .iconfont {
    color: #fff;
  }
  :deep(.green-c) {
    color: #0052d9;
  }
}
.title {
  color: #dbe0e8;
  border-bottom: 1px solid #dbe0e8;
  margin-bottom: 8px;
}
.ant-modal-content {
  padding: 0;
}
</style>
