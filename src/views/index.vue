<template>
  <div class="home-main">
    <div class="conversation">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="flex items-center item"
        :class="{ active: active === item.conversationID }"
        @click="routePage(item)"
        @contextmenu.prevent.stop="rightChange($event, item)"
      >
        <a-badge class="relative" :count="item.unreadCount">
          <a-avatar shape="square" :src="item?.userProfile?.avatar" :size="40" />
          <div
            class="status"
            :class="{ lx: item.statusType === '离线', zx: item.statusType === '在线' }"
          ></div>
        </a-badge>
        <div class="pl-2">
          <div class="text-14px">{{ item.remark || item?.userProfile?.nick }}</div>
          <div class="text-12px pt-1 c-gray messageForShow">
            {{ item?.lastMessage?.messageForShow }}
          </div>
        </div>
        <p class="time" v-if="item?.lastMessage?.lastTime">
          {{ timeFrom(item?.lastMessage?.lastTime) }}
        </p>
      </div>
      <a-empty description="暂无数据" :image="simpleImage" class="pt-10" v-if="!list.length">
      </a-empty>
    </div>
    <div class="chat">
      <TUIChat ref="chatRef">
        <div class="content flex flex-col justify-center items-center">
          <img class="img" src="@/assets/img2.png" />
          <div class="">欢迎使用IM</div>
        </div>
      </TUIChat>
    </div>
  </div>
  <context-menu v-model:show="show" :options="options">
    <context-menu-item label="删除聊天" @click="onMenuClick" />
  </context-menu>
</template>

<script setup>
import { Empty } from 'ant-design-vue'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
import { ref, onMounted, watch, onBeforeUnmount, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { useToken } from '@/store'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
const list = ref([])
const active = ref(null)
const route = useRoute()
const chatRef = ref({})
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
let usetoken = useToken()
watch(
  () => usetoken.remark,
  () => dataFn(),
  {
    deep: true
  }
)
watch(
  () => route.query.c,
  () => {
    if (!route.query.c) return false
    active.value = 'C2C' + route.query.c
    window.$chat.getConversationProfile('C2C' + route.query.c).then((imResponse) => {
      if (imResponse.data.conversation) {
        chatRef.value.conversation = imResponse.data.conversation
        let TUIServer = window.TUIKitTUICore.TUIServer
        TUIServer.TUISearch.TUICore.TUIServer.TUIConversation.handleCurrentConversation(
          imResponse.data.conversation
        )
      }
    })
  },
  {
    deep: true,
    immediate: true
  }
)
function timeFrom(val) {
  return dayjs(val * 1000).fromNow()
}
let time = null
// 获取会话列表
function dataFn() {
  window.$chat.getConversationList().then(({ data }) => {
    list.value = data.conversationList
    let uid = list.value.map((item) => item.userProfile?.userID)
    if (uid.length) {
      // 获取状态
      window.$chat
        .getUserStatus({ userIDList: uid })
        .then((event) => listFn(event.data.successUserList))
      window.$chat.on(window.$tx.EVENT.USER_STATUS_UPDATED, (event) => listFn(event.daat))
      time = setInterval(() => {
        window.$chat
          .getUserStatus({ userIDList: uid })
          .then((event) => listFn(event.data.successUserList))
      }, 1000)
    }
  })
}
onUnmounted(() => {
  clearInterval(time)
  time = null
})
onBeforeUnmount(() => {
  clearInterval(time)
  time = null
})
function listFn(all) {
  list.value = list.value.map((vim) => {
    let that = all.find((e) => e.userID === vim.userProfile?.userID)
    return {
      ...vim,
      statusType: statusTypeFn(that.statusType)
    }
  })
}
function statusTypeFn(val) {
  if (val === window.$tx.TYPES.USER_STATUS_UNKNOWN) {
    return '未知'
  } else if (val === window.$tx.TYPES.USER_STATUS_ONLINE) {
    return '在线'
  } else if (val === window.$tx.TYPES.USER_STATUS_OFFLINE) {
    return '离线'
  } else if (val === window.$tx.TYPES.USER_STATUS_UNLOGINED) {
    return '未登录'
  }
}
function routePage(item) {
  active.value = item.conversationID
  window.$chat.getConversationProfile(item.conversationID).then((imResponse) => {
    if (imResponse.data.conversation) {
      chatRef.value.conversation = imResponse.data.conversation
      let TUIServer = window.TUIKitTUICore.TUIServer
      TUIServer.TUISearch.TUICore.TUIServer.TUIConversation.handleCurrentConversation(
        imResponse.data.conversation
      )
    }
  })
}
const show = ref(false)
const options = ref({
  zIndex: 3,
  width: 60,
  x: 500,
  y: 200
})
const that = ref({})
function rightChange(e, vim) {
  options.value.x = e.x
  options.value.y = e.y
  show.value = true
  that.value = vim
}
// 删除聊天
function onMenuClick() {
  window.$chat.deleteConversation(that.value.conversationID).then(() => {
    window.$message.success('删除成功')
    dataFn()
  })
}
</script>
<style lang="scss" scoped>
.chat {
  flex: 1;
  position: relative;
  height: 100%;
  width: calc(100% - 250px);
  .content {
    width: 100%;
    height: 100%;
  }
}
.item {
  width: 100%;
  padding: 12px;
  cursor: pointer;
  position: relative;
  .time {
    position: absolute;
    top: 12px;
    right: 10px;
    font-size: 12px;
    color: #999;
  }
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
  .messageForShow {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    max-width: 180px;
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
.content {
  img {
    width: 100px;
    object-fit: scale-down;
  }
  div {
    color: #666;
    font-size: 12px;
    padding-top: 6px;
    letter-spacing: 1px;
  }
}
.status {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  &.lx {
    background-color: #666;
  }
  &.zx {
    background-color: #95ec69;
  }
}
</style>
