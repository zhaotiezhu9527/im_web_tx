<template>
  <div class="home-TUIKit-main">
    <div class="conversation">
      <div class="search flex items-center justify-between p-2">
        <a-input class="input" @pressEnter="change" v-model:value="search" placeholder="添加好友" />
        <div class="icon ml-2" @click="router.push('/friend')">取消</div>
      </div>
      <div
        v-for="(item, index) in list"
        :key="index"
        class="flex items-center item"
        @click="routePage(item)"
      >
        <a-avatar shape="square" :src="item.avatar" :size="40" />
        <div class="pl-2 text-14px">{{ item.nick }}</div>
      </div>
      <a-empty description="暂无数据" :image="simpleImage" class="pt-10" v-if="!list.length">
      </a-empty>
    </div>
    <div class="chat">
      <infoscn ref="infoRef" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
const router = useRouter()
import { Empty } from 'ant-design-vue'
import infoscn from '@/components/infos.vue'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

onMounted(() => {
  //好友或者自己的资料更新
  window.$chat.on(window.$tx.EVENT.PROFILE_UPDATED, () => dataFn())
})
// 获取好友列表
const list = ref([])
const search = ref('')
const infos = ref({})
const infoRef = ref({})
// 回车搜索
function change() {
  if (Cookies.get('userID') === search.value) {
    window.$message.info('不能添加自己为好友')
    return false
  }
  dataFn()
}
function dataFn() {
  window.$chat
    .getUserProfile({ userIDList: [search.value] })
    .then(({ data }) => {
      list.value = data
      infos.value = data[0]
      infoRef.value.open(infos.value)
    })
    .catch((imError) => {
      window.$message.error(imError.message)
    })
}
function routePage(vim) {
  infoRef.value.open(vim)
}
</script>
<style lang="scss" scoped>
.home-TUIKit-main {
  display: flex;
  height: 100%;
}
.conversation {
  width: 285px;
  flex: 0 0 24%;
  height: 100%;
  border-right: 1px solid #f4f5f9;
}
.chat {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 760px;
}
.icon {
  cursor: pointer;
  font-size: 12px;
  width: 35px;
  letter-spacing: 1px;
  user-select: none;
}
.input {
  height: 28px;
  line-height: 28px;
  background-color: #ebebeb;
  border: 0;
  border-radius: 4px;
}
.item {
  width: 100%;
  padding: 6px 10px;
  cursor: pointer;
  &:hover {
    background-color: #ebebeb;
  }
}
</style>
