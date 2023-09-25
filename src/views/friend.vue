<template>
  <div class="home-main">
    <div class="conversation">
      <div class="flex items-center item" :class="{ active: active === 1 }" @click="active = 1">
        <a-badge :count="count">
          <div class="font-icon">
            <i class="iconfont icon-tianjiahaoyou text-30px"></i>
          </div>
        </a-badge>
        <div class="pl-2 text-14px">消息中心</div>
      </div>
      <div class="flex items-center item" :class="{ active: active === 2 }" @click="active = 2">
        <div class="font-icon">
          <i class="iconfont icon-jurassic_user text-20px"></i>
        </div>
        <div class="pl-2 text-14px">黑名单</div>
      </div>
      <div class="flex items-center item" :class="{ active: active === 3 }" @click="active = 3">
        <div class="font-icon">
          <i class="iconfont icon-jurassic_user text-20px"></i>
        </div>
        <div class="pl-2 text-14px">我的好友</div>
      </div>
    </div>
    <div class="chat">
      <div class="header">
        {{ active === 1 ? '消息中心' : active === 2 ? '黑名单' : '我的好友' }}
      </div>
      <FriendCon v-if="active === 3" />
      <blackCon v-if="active === 2" />
      <newfriendCon v-if="active === 1" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import FriendCon from '@/components/FriendCon.vue'
import blackCon from '@/components/blackCon.vue'
import newfriendCon from '@/components/newfriendCon.vue'
const count = ref(0)
const active = ref(3)

onMounted(() => {
  // 好友申请触发
  window.$chat.on(window.$tx.EVENT.FRIEND_APPLICATION_LIST_UPDATED, (event) => {
    // unreadCount - 好友申请的未读数
    const { unreadCount } = event.data
    count.value = unreadCount
  })
})
</script>
<style lang="scss" scoped>
.header {
  padding: 12px;
  height: 55px;
  display: flex;
  justify-content: space-between;
  background-color: #f6f8fa;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  z-index: 10;
  top: 0;
}
.chat {
  height: 100%;
  position: relative;
  background-color: #f6f8fa;
  width: calc(100% - 250px);
  overflow-x: 0;
  overflow-y: auto;
  .iconfont {
    font-size: 200px;
    color: #eee;
  }
}
.item {
  width: 100%;
  padding: 12px;
  cursor: pointer;
  &.active,
  &:hover {
    background-color: #ebf3fc;
  }
  &:nth-child(1) {
    .font-icon {
      background-color: #60cfa7;
    }
  }
  &:nth-child(2) {
    .font-icon {
      background-color: #53c3f3;
    }
  }
  &:nth-child(3) {
    .font-icon {
      background-color: #537ff4;
    }
  }
  .font-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
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
</style>
