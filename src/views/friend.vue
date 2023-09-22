<template>
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
          <div class="pl-2 text-14px" v-html="titleFn(vim.remark || vim.profile.nick)"></div>
        </div>
      </div>
      <a-empty description="暂无数据" :image="simpleImage" class="pt-10" v-if="!list.length">
      </a-empty>
    </div>
    <div class="chat">
      <infoscn ref="infoRef" @ok="dataFn" />
      <i class="iconfont icon-icon-test37" v-if="!infos"></i>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Empty } from 'ant-design-vue'
import infoscn from '@/components/infos.vue'
import { pinyin } from 'pinyin-pro'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const router = useRouter()
const count = ref(0)

const list = ref([])
const listAll = ref([])
const search = ref('')

//For component
dataFn()
onMounted(() => {
  //好友或者自己的资料更新
  window.$chat.on(window.$tx.EVENT.PROFILE_UPDATED, () => dataFn())
  // 好友列表更新
  window.$chat.on(window.$tx.EVENT.FRIEND_LIST_UPDATED, () => dataFn())
  // 黑名单列表更新
  window.$chat.on(window.$tx.EVENT.BLACKLIST_UPDATED, () => dataFn())
  // 好友申请触发
  window.$chat.on(window.$tx.EVENT.FRIEND_APPLICATION_LIST_UPDATED, (event) => {
    // unreadCount - 好友申请的未读数
    const { unreadCount } = event.data
    count.value = unreadCount
  })
})
// 获取好友列表
function dataFn() {
  list.value = []
  listAll.value = []
  window.$chat.getFriendList().then(({ data }) => {
    if (!data.length) {
      listAll.value = JSON.parse(JSON.stringify(list.value))
      return false
    }
    data.forEach((e) => {
      e.cn = pinyin(e.remark || e.profile.nick)
      e.en = pinyin(e.remark || e.profile.nick).slice(0, 1)
      let that = list.value.find(
        (item) => item.en === pinyin(e.remark || e.profile.nick).slice(0, 1)
      )
      if (that) {
        that.list.push(e)
      } else {
        list.value.push({
          en: pinyin(e.remark || e.profile.nick).slice(0, 1),
          list: [e]
        })
      }
    })
    list.value = list.value.map((item) => {
      return {
        en: item.en,
        list: item.list.sort((a, b) => {
          console.log(a)
          return a.cn.localeCompare(b.cn)
        })
      }
    })
    list.value = list.value.sort((a, b) => {
      return a.cn.localeCompare(b.cn)
    })
    listAll.value = JSON.parse(JSON.stringify(list.value))
  })
}

function change() {
  let all = JSON.parse(JSON.stringify(listAll.value))
  list.value = all.filter((item) => {
    item.list = item.list.filter(
      (e) => e?.profile?.nick.includes(search.value) || e?.remark.includes(search.value)
    )
    return item.list.length
  })
}
const infoRef = ref({})
const infos = ref('')
const active = ref(null)
function routePage(vim) {
  active.value = vim.userID
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
  width: 285px;
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
.title {
  font-size: 14px;
  padding: 4px 8px;
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
