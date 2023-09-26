<template>
  <div>
    <a-modal
      v-model:open="show"
      class="searchModel"
      style="width: 630px"
      centered
      @cancel="cancel"
      :mask="false"
      :closable="false"
    >
      <template #title>
        <div class="pt-3 flex items-center header">
          <a-input
            class="input"
            v-model:value="search"
            @pressEnter="change"
            @input="change"
            placeholder="请搜索好友"
          >
            <template #prefix> <i class="iconfont icon-icon-test12"></i> </template>
          </a-input>
          <i class="iconfont icon-cuowuguanbiquxiao ml-3 cursor-pointer" @click="cancel"></i>
        </div>
      </template>
      <div class="content">
        <div class="title" v-if="list.length">好友</div>

        <div v-for="(item, index) in list" :key="index">
          <div class="title">{{ item.en }}</div>
          <div
            v-for="(vim, ix) in item.list"
            :key="ix"
            class="flex items-center justify-between item pt-2"
            @click="routePage(vim)"
          >
            <div class="flex items-center">
              <a-avatar shape="square" :src="vim.profile.avatar" :size="40" />
              <div class="pl-2 text-14px" v-html="titleFn(vim.remark || vim.profile.nick)"></div>
            </div>
          </div>
        </div>
        <a-empty description="暂无数据" :image="simpleImage" class="pt-10" v-if="!list.length">
        </a-empty>
      </div>
      <template #footer> </template>
    </a-modal>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Empty } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { pinyin } from 'pinyin-pro'
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const router = useRouter()
// 添加好友
const show = ref(false)
const list = ref([])
const listAll = ref([])
const search = ref('')
function open() {
  show.value = true
  dataFn()
}
function cancel() {
  search.value = ''
  show.value = false
}
function titleFn(e) {
  let title = e.replace(search.value, `<span class='green-c'>${search.value}</span>`)
  return title
}
function change() {
  // let all = JSON.parse(JSON.stringify(listAll.value))
  // list.value = all.filter(
  //   (item) =>
  //     item?.profile?.nick.includes(search.value) ||
  //     item?.remark.includes(search.value) ||
  //     item?.profile?.userID.includes(search.value)
  // )
  let all = JSON.parse(JSON.stringify(listAll.value))
  list.value = all.filter((item) => {
    item.list = item.list.filter(
      (e) =>
        e?.profile?.nick.includes(search.value) ||
        e?.remark.includes(search.value) ||
        item?.profile?.userID.includes(search.value)
    )
    return item.list.length
  })
}
function dataFn() {
  search.value = ''
  list.value = []
  listAll.value = []
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
        en: nameFn(item.en),
        list: item?.list?.sort((a, b) => {
          return a?.cn?.localeCompare(b.cn)
        })
      }
    })
    list.value = list.value.sort((a, b) => {
      return a?.en?.localeCompare(b.en)
    })
    listAll.value = JSON.parse(JSON.stringify(list.value))
  })
}
let txtAll = [
  { key: 'a', val: ['ā', 'á', 'ǎ', 'à'] },
  { key: 'o', val: ['ō', 'ó', 'ǒ', 'ò'] },
  { key: 'e', val: ['ê', 'ē', 'é', 'ě', 'è'] },
  { key: 'i', val: ['ī', 'í', 'ǐ', 'ì'] },
  { key: 'u', val: ['ū', 'ú', 'ǔ', 'ù'] }
]
function nameFn(val) {
  let that = txtAll.find((e) => e.val.includes(val))
  return that?.key?.toUpperCase() || val.toUpperCase()
}
function routePage(item) {
  router.push('/?c=' + item.userID)
  show.value = false
}
defineExpose({ open })
</script>
<style lang="scss" scoped>
.input,
.button {
  border-radius: 0 !important;
}
.item {
  width: 100%;
  padding: 6px 10px;
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
.title {
  color: #dbe0e8;
  border-bottom: 1px solid #dbe0e8;
  margin-bottom: 8px;
}
.ant-modal-content {
  padding: 0;
}
.content {
  overflow: auto;
  height: 400px;
}
</style>
