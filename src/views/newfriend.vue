<template>
  <div class="app">
    <Menu />
    <div class="home-TUIKit-main">
      <div class="conversation">
        <div class="search flex items-center justify-between p-2">
          <a-input class="input" @pressEnter="change" v-model:value="search" placeholder="搜索" />
          <div class="icon ml-2 text-5" @click="router.push('/friend')">
            <i class="iconfont icon-icon-test59"></i>
          </div>
        </div>
        <div
          v-for="(item, index) in list"
          :key="index"
          class="flex items-center item"
          :class="{ active: active === index }"
          @click="routePage(item, index)"
        >
          <a-avatar shape="square" :src="item.avatar" :size="40" />
          <div class="pl-2 text-14px">{{ item.nick }}</div>
        </div>
        <a-empty description="暂无数据" :image="simpleImage" class="pt-10" v-if="!list.length">
        </a-empty>
      </div>
      <div class="chat">
        <detail ref="detailRef" @ok="infos = ''" />
        <i class="iconfont icon-icon-test37" v-if="!infos"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import Menu from '@/components/menu.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Empty } from 'ant-design-vue'
import detail from '@/components/detail.vue'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const router = useRouter()
// 获取好友列表
const list = ref([])
const search = ref('')
const infos = ref('')

onMounted(() => {
  dataFn()
  // 好友申请触发
  window.$chat.on(window.$tx.EVENT.FRIEND_APPLICATION_LIST_UPDATED, (event) => {
    const { friendApplicationList } = event.data
    list.value = friendApplicationList
  })
})

function dataFn() {
  window.$chat.getFriendApplicationList().then(({ data }) => {
    list.value = data.friendApplicationList
  })
}
// 搜索
function change() {}
const detailRef = ref({})
const active = ref(null)
function routePage(vim, index) {
  active.value = index
  infos.value = vim
  detailRef.value.open(vim)
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
  overflow-x: hidden;
  overflow-y: auto;
}
.chat {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 760px;
  .iconfont {
    font-size: 200px;
    color: #eee;
  }
}
.icon {
  background-color: #ebebeb;
  border-radius: 4px;
  cursor: pointer;
  height: 28px;
  width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
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
.item {
  width: 100%;
  padding: 6px 10px;
  cursor: pointer;
  &.active,
  &:hover {
    background-color: #ebebeb;
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
}
</style>
