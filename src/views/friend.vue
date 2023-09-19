<template>
  <div class="app">
    <Menu />
    <div class="home-TUIKit-main">
      <div class="conversation">
        <div class="search flex items-center justify-between p-2">
          <a-input class="input" v-model:value="search" placeholder="搜索" />
          <div class="icon ml-2 text-5" @click="router.push('/add')">+</div>
        </div>
        <a-list size="small" :data-source="list" :locale="{ emptyText: '暂无数据' }">
          <template #renderItem="{ item }">
            <a-list-item>{{ item }}</a-list-item>
          </template>
        </a-list>
      </div>
      <div class="chat"></div>
    </div>
  </div>
</template>

<script setup>
import Menu from '@/components/menu.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(() => {
  dataFn()
})
// 获取好友列表
const list = ref([])
const search = ref('')
function dataFn() {
  window.$chat.getFriendList().then(({ data }) => {
    console.log(data)
  })
}
</script>
<style lang="scss" scoped>
.home-TUIKit-main {
  display: flex;
  height: 100%;
}
.conversation {
  min-width: 285px;
  flex: 0 0 24%;
  height: 100%;
  border-right: 1px solid #f4f5f9;
}
.chat {
  flex: 1;
  height: 100%;
  position: relative;
}
.icon {
  background-color: #ebebeb;
  border-radius: 4px;
  cursor: pointer;
  height: 28px;
  width: 28px;
  display: flex;
  justify-content: center;
  color: #666;
  user-select: none;
}
.input {
  height: 28px;
  line-height: 28px;
  background-color: #ebebeb;
  border: 0;
  border-radius: 4px;
}
</style>
