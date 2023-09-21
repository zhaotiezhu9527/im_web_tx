<template>
  <div v-if="items" class="rows">
    <div class="flex items-center pb-4 border-bottom">
      <a-avatar :size="70" :src="items.avatar" />
      <div class="content pl-2">
        <div class="text-14px pb-2">昵称：{{ infos.remark || items.nick }}</div>
        <div class="text-14px">账号：{{ items.userID }}</div>
      </div>
    </div>
    <div class="list">
      <div class="item" v-if="form.relation === 'CheckResult_Type_BothWay'">
        <span>备注：</span>
        <div class="flex">
          <a-input
            class="mr-2"
            v-model:value="form.remark"
            placeholder="请输入备注"
            v-if="form.show"
            @pressEnter="input"
          />
          <div v-else :class="{ 'mr-2': infos.remark }">{{ infos.remark }}</div>
          <i class="iconfont cursor-pointer icon-bianji" @click="showChange"></i>
        </div>
      </div>
      <div class="item">
        <span>性别：</span>
        <div>{{ genderFn() }}</div>
      </div>
      <div class="item">
        <span>个性签名：</span>
        <div>{{ items.selfSignature }}</div>
      </div>
      <div class="btn flex flex-col">
        <a-button
          class="my-3"
          type="primary"
          @click="service"
          v-if="form.relation === 'CheckResult_Type_BothWay' && form.type !== 'message'"
        >
          聊天
        </a-button>
        <a-button
          class="my-3"
          type="primary"
          @click="form.open = true"
          v-if="form.relation === 'CheckResult_Type_NoRelation' && form.type !== 'black'"
        >
          添加好友
        </a-button>
        <a-button
          type="link"
          @click="blackChange"
          v-if="form.relation === 'CheckResult_Type_BothWay' || form.type === 'black'"
        >
          {{ form.black ? '移除' : '加入' }}黑名单
        </a-button>
        <a-button
          class="my-3"
          type="text"
          color="red"
          @click="delChange"
          v-if="form.relation === 'CheckResult_Type_BothWay'"
        >
          删除
        </a-button>
      </div>
    </div>
    <a-modal v-model:open="form.open" title="添加好友" centered @cancel="cancel">
      <div class="p-10">
        <div class="pl-2 pb-1">备注：</div>
        <a-input class="input" v-model:value="form.name" placeholder="请输入备注" />
        <div class="pl-2 pt-5 pb-1">留言：</div>
        <a-textarea
          class="input"
          v-model:value="form.textarea"
          placeholder="请输入留言"
          :rows="4"
        />
      </div>
      <template #footer>
        <a-button type="primary" @click="handleOk"> 确定 </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script setup>
import { ref, createVNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
const route = useRoute()
const router = useRouter()
const items = ref('')
const infos = ref('')
const form = ref({
  remark: '', // 备注
  show: false, // 是否显示输入框
  relation: '', // 好友关系
  black: false, // 是否为黑名单
  open: false,
  name: '',
  type: route?.query?.type,
  textarea: ''
})
function open(val) {
  items.value = val
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
  switch (this.items.gender) {
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
// 备注修改
function input() {
  window.$chat
    .updateFriend({
      userID: items.value.userID,
      remark: form.value.remark
    })
    .then(() => {
      window.$message.success('修改成功！')
    })
}
function showChange() {
  form.value.show = !form.value.show
}
// 添加好友
function handleOk() {
  let is_ok = window.$tx.TYPES.ALLOW_TYPE_ALLOW_ANY === items.value.allowType
  // is_ok 为真则为双向添加，否则单向添加
  window.$chat
    .addFriend({
      to: items.value.userID,
      source: 'AddSource_Type_Web',
      remark: form.value.name,
      groupName: '好友',
      wording: form.value.textarea,
      type: is_ok ? window.$tx.TYPES.SNS_ADD_TYPE_BOTH : window.$tx.TYPES.SNS_ADD_TYPE_SINGLE // 单向添加
    })
    .then((imResponse) => {
      // 添加好友的请求发送成功
      const { code } = imResponse.data
      if (code === 30539) {
        window.$message.success('提交成功，等待对方验证！')
      } else if (code === 0) {
        window.$message.success('添加好友成功！')
      }
      form.value.open = false
      cancel()
    })
    .catch((error) => {
      window.$message.error(error.message)
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
// 聊天
function service() {
  router.push(`/?c=C2C${items.value.userID}`)
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
    .then(() => {})
}

// 关闭添加好友对话框
function cancel() {
  form.value.name = ''
  form.value.textarea = ''
}
defineExpose({ open })
</script>
<style lang="scss" scoped>
.rows {
  width: 400px;
  padding: 40px;
  .border-bottom {
    border-bottom: 1px solid #eee;
  }
}
.list {
  padding-top: 20px;
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
