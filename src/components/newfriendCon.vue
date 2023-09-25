<template>
  <div>
    <div
      v-for="(item, index) in list"
      :key="index"
      class="flex items-center item"
      :class="{ active: active === index }"
      @click="routePage(item)"
    >
      <a-avatar shape="square" :src="item.avatar" :size="40" />
      <div class="pl-2 text-14px" v-html="item.nick"></div>
    </div>
    <a-empty description="暂无数据" :image="simpleImage" class="pt-10" v-if="!list.length">
    </a-empty>
    <detail ref="detailRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Empty } from 'ant-design-vue'
import detail from '@/components/detail.vue'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
// 获取好友列表
const list = ref([])
dataFn()
// 好友申请触发
window.$chat.on(window.$tx.EVENT.FRIEND_APPLICATION_LIST_UPDATED, (event) => {
  const { friendApplicationList } = event.data
  JSON.parse(JSON.stringify(friendApplicationList))
  list.value = friendApplicationList
})

function dataFn() {
  window.$chat.getFriendApplicationList().then(({ data }) => {
    list.value = data.friendApplicationList
  })
}
const detailRef = ref({})
const active = ref(null)
function routePage(vim) {
  detailRef.value.open(vim)
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
  overflow-x: 0;
  overflow-y: auto;
  width: 760px;
  .iconfont {
    font-size: 200px;
    color: #eee;
  }
}
.icon {
  background-color: #ebf3fc;
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
  background-color: #ebf3fc;
  border: 0;
  border-radius: 4px;
}
.item {
  width: 100%;
  padding: 12px;
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
</style>
