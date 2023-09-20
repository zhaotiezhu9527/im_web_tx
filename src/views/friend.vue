<template>
  <div class="app">
    <Menu />
    <div class="home-TUIKit-main">
      <div class="conversation">
        <div class="search flex items-center justify-between p-2">
          <a-input class="input" @pressEnter="change" v-model:value="search" placeholder="搜索" />
          <div class="icon ml-2 text-5" @click="router.push('/add')">+</div>
        </div>
        <div class="flex items-center item" @click="router.push('/newfriend')">
          <a-badge :count="count">
            <div class="font-icon">
              <i class="iconfont icon-tianjiahaoyou text-30px"></i>
            </div>
          </a-badge>
          <div class="pl-2 text-14px">新的朋友</div>
        </div>
        <div class="flex items-center item" @click="router.push('/black?type=black')">
          <div class="font-icon">
            <i class="iconfont icon-jurassic_user text-20px"></i>
          </div>
          <div class="pl-2 text-14px">黑名单</div>
        </div>
        <div
          v-for="(item, index) in list"
          :key="index"
          class="flex items-center item"
          :class="{ active: active === index }"
          @click="routePage(item, index)"
        >
          <a-avatar shape="square" :src="item.profile?.avatar" :size="40" />
          <div class="pl-2 text-14px">{{ item.remark || item.profile.nick }}</div>
        </div>
        <a-empty description="暂无数据" :image="simpleImage" class="pt-10" v-if="!list.length">
        </a-empty>
      </div>
      <div class="chat">
        <infoscn ref="infoRef" />
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
import infoscn from '@/components/infos.vue'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const router = useRouter()
const count = ref(0)

dataFn()
onMounted(() => {
  //好友或者自己的资料更新
  window.$chat.on(window.$tx.EVENT.PROFILE_UPDATED, () => dataFn())
  // 好友列表更新
  window.$chat.on(window.$tx.EVENT.FRIEND_LIST_UPDATED, () => dataFn())
  // 好友申请触发
  window.$chat.on(window.$tx.EVENT.FRIEND_APPLICATION_LIST_UPDATED, (event) => {
    // unreadCount - 好友申请的未读数
    const { unreadCount } = event.data
    count.value = unreadCount
  })
})
// 获取好友列表
const list = ref([])
const search = ref('')
function dataFn() {
  window.$chat.getFriendList().then(({ data }) => {
    list.value = data
  })
}

function change() {}
const infoRef = ref({})
const infos = ref('')
const active = ref(null)
function routePage(vim, index) {
  active.value = index
  infos.value = vim
  infoRef.value.open(vim)
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
  overflow-x: hidden;
  overflow-y: auto;
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
