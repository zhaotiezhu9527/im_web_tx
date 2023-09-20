<template>
  <div class="app">
    <Menu />
    <div class="home-TUIKit-main">
      <div class="conversation">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="flex items-center item"
          :class="{ active: active === index }"
          @click="routePage(item, index)"
        >
          <a-badge :count="item.unreadCount">
            <a-avatar shape="square" :src="item?.userProfile?.avatar" :size="40" />
          </a-badge>
          <div class="pl-2">
            <div class="text-14px">{{ item.remark || item?.userProfile?.nick }}</div>
            <div class="text-12px pt-1 c-gray">{{ item?.lastMessage?.messageForShow }}</div>
          </div>
          <p class="time" v-if="item?.lastMessage?.lastTime">
            {{ timeFrom(item?.lastMessage?.lastTime) }}
          </p>
        </div>
        <a-empty description="暂无数据" :image="simpleImage" class="pt-10" v-if="!list.length">
        </a-empty>
      </div>
      <div class="chat">
        <TUIChat>
          <div class="content flex justify-center items-center">
            <i class="iconfont icon-icon-test3"></i>
          </div>
        </TUIChat>
      </div>
    </div>
  </div>
</template>

<script setup>
import Menu from '@/components/menu.vue'
import { Empty } from 'ant-design-vue'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
const list = ref([])
const active = ref(null)
onMounted(() => {
  dataFn()
  //好友或者自己的资料更新
  window.$chat.on(window.$tx.EVENT.PROFILE_UPDATED, () => dataFn())
  //会话列表更新
  window.$chat.on(window.$tx.EVENT.CONVERSATION_LIST_UPDATED, () => dataFn())
  //SDK 收到推送的单聊、群聊、群提示、群系统通知的新消息
  window.$chat.on(window.$tx.EVENT.MESSAGE_MODIFIED, () => dataFn())
  //消息回应更新通知
  window.$chat.on(window.$tx.EVENT.MESSAGE_REACTIONS_UPDATED, () => dataFn())
})
function timeFrom(val) {
  return dayjs(val).fromNow()
}
// 获取会话列表
function dataFn() {
  window.$chat.getConversationList().then(({ data }) => {
    list.value = data.conversationList
  })
}
function routePage(item, index) {
  active.value = index
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
  padding-top: 10px;
}
.chat {
  flex: 1;
  height: 100%;
  position: relative;
  .content {
    width: 760px;
    height: 100%;
    .iconfont {
      font-size: 200px;
      color: #eee;
    }
  }
}
.item {
  width: 100%;
  padding: 6px 10px;
  cursor: pointer;
  position: relative;
  .time {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 12px;
    color: #999;
  }
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
