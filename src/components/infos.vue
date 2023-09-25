<template>
  <div>
    <a-modal class="modalInfo" v-model:open="form.show" centered :closable="false" :mask="false">
      <template #title>
        <div class="header">
          <div class="flex items-center border-bottom">
            <a-avatar :size="70" :src="items.avatar" />
            <div class="content pl-2">
              <div class="text-14px text-white">{{ infos.remark || items.nick }}</div>
            </div>
          </div>
          <a-tooltip placement="bottom" arrow-point-at-center color="#ffffff">
            <template #title>
              <div class="tooltip">
                <div
                  class="li"
                  @click="addConRef.open(items)"
                  v-if="form.relation === 'CheckResult_Type_NoRelation' && form.type !== 'black'"
                >
                  添加好友
                </div>
                <div
                  class="li"
                  @click="blackChange"
                  v-if="form.relation === 'CheckResult_Type_BothWay' || form.type === 'black'"
                >
                  {{ form.black ? '解除' : '' }}拉黑
                </div>
                <div
                  class="li"
                  v-if="form.relation === 'CheckResult_Type_BothWay'"
                  @click="delChange"
                >
                  删除好友
                </div>
              </div>
            </template>
            <i class="iconfont icon-sandian1"></i>
          </a-tooltip>
        </div>
      </template>
      <div class="rows">
        <div class="list">
          <div class="item" v-if="form.relation === 'CheckResult_Type_BothWay'">
            <span>备注：</span>
            <div class="flex">
              <a-input
                class="mr-2"
                v-model:value="form.remark"
                placeholder="请输入备注"
                @blur="input"
              />
            </div>
          </div>
          <div class="item">
            <span>账号：</span>
            <div>{{ items.userID }}</div>
          </div>
          <div class="item">
            <span>性别：</span>
            <div>{{ genderFn() }}</div>
          </div>
          <div class="item">
            <span>签名：</span>
            <div>{{ items.selfSignature }}</div>
          </div>
          <div class="btn flex flex-col">
            <a-button
              class="my-3"
              type="primary"
              @click="service"
              v-if="form.relation === 'CheckResult_Type_BothWay'"
            >
              聊天
            </a-button>
          </div>
        </div>
      </div>
      <template #footer></template>
    </a-modal>
    <addCon ref="addConRef" />
  </div>
</template>
<script setup>
import addCon from '@/components/addCon.vue'
import { ref, createVNode } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { useToken } from '@/store'
import { useRouter } from 'vue-router'
const addConRef = ref({})
const items = ref('')
const infos = ref('')
const form = ref({
  remark: '', // 备注
  relation: '', // 好友关系
  black: false, // 是否为黑名单
  show: false,
  name: '',
  type: '',
  textarea: ''
})
function open(val, type) {
  form.value.show = true
  items.value = val
  form.value.type = type
  dataFn()
  friendFn(val.userID)
  checkFriendFn()
  // 好友的资料更新
  window.$chat.on(window.$tx.EVENT.PROFILE_UPDATED, () => {
    dataFn()
    friendFn()
    checkFriendFn()
  })
  // 好友列表更新
  window.$chat.on(window.$tx.EVENT.FRIEND_LIST_UPDATED, () => {
    dataFn()
    friendFn()
    checkFriendFn()
  })
}
function genderFn() {
  let name = ''
  switch (items.value.gender) {
    case 'Gender_Type_Male':
      name = '男'
      break
    case 'Gender_Type_Female':
      name = '女'
      break
    default:
      name = ''
      break
  }
  return name
}
const emit = defineEmits(['ok'])
// 刷新后获取个人信息
function dataFn() {
  window.$chat
    .getUserProfile({ userIDList: [items.value.userID] })
    .then(({ data }) => {
      items.value = data[0]
    })
    .catch((imError) => {
      window.$message.error(imError.message)
    })
}
// 获取的好友数据
function friendFn(id) {
  window.$chat
    .getFriendProfile({
      userIDList: [id]
    })
    .then(({ data }) => {
      if (data.friendList.length) {
        infos.value = data.friendList[0]
        form.value.remark = infos.value.remark
      }
    })
    .catch(function (imError) {
      window.$message.error(imError.message)
    })
}
// 获取好友关系
function checkFriendFn() {
  window.$chat
    .checkFriend({
      userIDList: [items.value.userID],
      type: window.$tx.TYPES.SNS_CHECK_TYPE_BOTH
    })
    .then((imResponse) => {
      const { successUserIDList, failureUserIDList } = imResponse.data
      // 校验成功的 userIDList
      successUserIDList.forEach((item) => {
        const { relation } = item
        form.value.relation = relation
        // - relation: TencentCloudChat.TYPES.SNS_TYPE_NO_RELATION A 的好友表中没有 B，但无法确定 B 的好友表中是否有 A
        // - relation: TencentCloudChat.TYPES.SNS_TYPE_A_WITH_B A 的好友表中有 B，但无法确定 B 的好友表中是否有 A
        form.value.black = relation === window.$tx.TYPES.SNS_TYPE_NO_RELATION
      })
      // 校验失败的 userIDList
      failureUserIDList.forEach(() => {})
    })
}
let usetoken = useToken()
// 备注修改
function input() {
  window.$chat
    .updateFriend({
      userID: items.value.userID,
      remark: form.value.remark
    })
    .then(() => {
      usetoken.setRemark(form.value.remark)
      window.$message.success('修改成功！')
    })
}
// 删除好友
function delChange() {
  Modal.confirm({
    title: '删除',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定删除该好友吗?',
    okText: '确定',
    cancelText: '取消',
    centered: true,
    onOk() {
      deleteFn()
    },
    onCancel() {}
  })
}
function deleteFn() {
  window.$chat
    .deleteFriend({
      userIDList: [items.value.userID],
      type: window.$tx.TYPES.SNS_DELETE_TYPE_BOTH
    })
    .then(({ data }) => {
      if (data.successUserIDList.length) {
        window.$message.success('删除成功！')
        // 检测是否有会话，有则删除
        window.$chat.getConversationList([`C2C${items.value.userID}`]).then(({ data }) => {
          if (data.conversationList.length) {
            window.$chat.deleteConversation(`C2C${items.value.userID}`).then(() => {})
          }
        })
      }
    })
}
const router = useRouter()
// 聊天
function service() {
  router.push(`/?c=${items.value.userID}`)
  form.value.show = false
  emit('ok')
}
// 加入移除黑名单
function blackChange() {
  if (!form.value.black) {
    // 移入黑名单
    window.$chat
      .addToBlacklist({ userIDList: [items.value.userID] })
      .then(() => {
        // 删除会话，不删除记录
        form.value.type = 'black'
        emit('ok')
        window.$chat.getConversationList([`C2C${items.value.userID}`]).then(({ data }) => {
          if (data.conversationList.length) {
            window.$chat
              .deleteConversation({
                conversationIDList: [`C2C${items.value.userID}`],
                clearHistoryMessage: false
              })
              .then(() => {})
              .catch(() => {})
          }
        })
      })
      .catch(() => {})
  } else {
    // 移除黑名单
    window.$chat
      .removeFromBlacklist({ userIDList: [items.value.userID] })
      .then(() => {
        emit('ok')
        form.value.type = ''
        addFriend()
      })
      .catch(() => {})
  }
}

// 移除黑名单默认添加一次好友，（无感添加）
function addFriend() {
  window.$chat
    .addFriend({
      to: items.value.userID,
      source: 'AddSource_Type_Web',
      remark: infos.value.remark,
      groupName: '好友',
      type: window.$tx.TYPES.SNS_ADD_TYPE_BOTH // 双向添加
    })
    .then(() => {
      dataFn()
    })
}

defineExpose({ open })
</script>
<style lang="scss" scoped>
.rows {
  padding: 24px;
}
.list {
  .item {
    font-size: 14px;
    line-height: 32px;
    display: flex;
    align-items: center;
    color: #666;
    span {
      width: 80px;
    }
  }
}
</style>
