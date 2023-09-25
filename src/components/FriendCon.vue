<template>
  <div>
    <div v-for="(item, index) in list" :key="index">
      <div class="title">{{ item.en }}</div>
      <div
        v-for="(vim, ix) in item.list"
        :key="ix"
        class="flex items-center item"
        :class="{ active: active === vim.userID }"
        @click="routePage(vim)"
      >
        <a-avatar shape="square" :src="vim.profile?.avatar" :size="40" />
        <div class="pl-2 text-14px">{{ vim.remark || vim.profile.nick }}</div>
      </div>
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
import { pinyin } from 'pinyin-pro'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE

const list = ref([])

dataFn()
// 黑名单列表更新
window.$chat.on(window.$tx.EVENT.BLACKLIST_UPDATED, () => dataFn())
//好友或者自己的资料更新
window.$chat.on(window.$tx.EVENT.PROFILE_UPDATED, () => dataFn())
// 好友列表更新
window.$chat.on(window.$tx.EVENT.FRIEND_LIST_UPDATED, () => dataFn())
// 获取好友列表
function dataFn() {
  list.value = []
  window.$chat.getFriendList().then(({ data }) => {
    if (!data.length) return false
    data.forEach((e) => {
      e.cn = pinyin(e.remark || e.profile?.nick)
      e.en = pinyin(e.remark || e.profile?.nick).slice(0, 1)
      let that = list.value.find(
        (item) => item.en === pinyin(e.remark || e.profile?.nick).slice(0, 1)
      )
      if (that) {
        that.list.push(e)
      } else {
        list.value.push({
          en: pinyin(e.remark || e.profile?.nick).slice(0, 1),
          list: [e]
        })
      }
    })
    list.value = list.value.map((item) => {
      return {
        en: item.en,
        list: item?.list?.sort((a, b) => {
          return a?.cn?.localeCompare(b.cn)
        })
      }
    })
    list.value = list.value.sort((a, b) => {
      return a?.cn?.localeCompare(b.cn)
    })
  })
}
const infoscnRef = ref({})
const active = ref(null)
function routePage(vim) {
  infoscnRef.value.open(vim)
}
</script>
<style lang="scss" scoped>
.title {
  margin: 16px 8px 8px;
  padding-bottom: 10px;
  font-size: 18px;
  border-bottom: 1px solid #e8e8e8;
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
