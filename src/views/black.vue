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
          <div class="pl-2 text-14px" v-html="titleFn(item.remark || item.profile.nick)"></div>
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
onMounted(() => {
  dataFn()
  // 黑名单列表更新
  window.$chat.on(window.$tx.EVENT.BLACKLIST_UPDATED, () => dataFn())
})
// 获取黑名单列表
const list = ref([])
const listAll = ref([])
const search = ref('')
function dataFn() {
  window.$chat.getBlacklist().then(({ data }) => {
    if (data.length) {
      window.$chat
        .getUserProfile({
          userIDList: data
        })
        .then((imResponse) => {
          listAll.value = JSON.parse(JSON.stringify(imResponse.data))
          list.value = imResponse.data
        })
    } else {
      list.value = []
    }
  })
}

function change() {
  let all = JSON.parse(JSON.stringify(listAll.value))
  list.value = all.filter(
    (item) => item.profile.nick.includes(search.value) || item.remark.includes(search.value)
  )
}
const infoRef = ref({})
const infos = ref('')
const active = ref(null)
function routePage(vim, index) {
  active.value = index
  infos.value = vim
  infoRef.value.open(vim)
}
function titleFn(e) {
  let title = e.replace(search.value, `<span class='green-c'>${search.value}</span>`)
  return title
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
  :deep(.green-c) {
    color: #0052d9;
  }
}
</style>
