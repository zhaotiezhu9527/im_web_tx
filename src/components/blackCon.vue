<template>
  <div>
    <div
      v-for="(item, index) in list"
      :key="index"
      class="flex items-center item"
      :class="{ active: active === index }"
      @click="routePage(item, index)"
    >
      <a-avatar shape="square" :src="item.avatar" :size="40" />
      <div class="pl-2 text-14px" v-html="item.nick"></div>
    </div>
    <a-empty description="暂无数据" :image="simpleImage" class="pt-10" v-if="!list.length">
    </a-empty>
    <infoscn ref="infoscnRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Empty } from 'ant-design-vue'
import infoscn from '@/components/infos.vue'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
dataFn()
// 黑名单列表更新
window.$chat.on(window.$tx.EVENT.BLACKLIST_UPDATED, () => dataFn())
// 获取黑名单列表
const list = ref([])
function dataFn() {
  window.$chat.getBlacklist().then(({ data }) => {
    if (data.length) {
      window.$chat
        .getUserProfile({
          userIDList: data
        })
        .then((imResponse) => {
          list.value = imResponse.data
        })
    } else {
      list.value = []
    }
  })
}

const infoscnRef = ref({})
function routePage(vim) {
  infoscnRef.value.open(vim, 'black')
}
</script>
<style lang="scss" scoped>
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
