<template>
  <h1>
    {{ title === '对方正在输入' ? $t('TUIChat.对方正在输入') : title
    }}<span v-if="is_status || !is_status">（{{ is_status }}）</span>
  </h1>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  watchEffect,
  watch,
  reactive,
  toRefs,
  computed,
  nextTick,
  onUnmounted
} from 'vue'
import { handleName, JSONToObject, isTypingMessage } from '../../utils/utils'
import constant from '../../../constant'
import { useToken } from '@/store'
const TypingHeader = defineComponent({
  props: {
    needTyping: {
      type: Boolean,
      default: false
    },
    conversation: {
      type: Object,
      default: () => ({})
    },
    messageList: {
      type: Array,
      default: () => []
    }
  },
  setup(props: any, ctx: any) {
    const data = reactive({
      messageList: [],
      conversation: {},
      title: '',
      timeValid: 0,
      myTypingStatus: 0,
      otherTypingStatus: 0,
      needTyping: false,
      lastOtherMessageTime: 0,
      lastMyTypingTime: 0,
      lastOtherTypingTime: 0,
      options: {
        data: {
          businessID: constant.typeUserTyping,
          typingStatus: 0,
          version: 1,
          userAction: 0,
          actionParam: constant.typeInputStatusEnd
        },
        description: '',
        extension: ''
      }
    })

    watchEffect(() => {
      data.messageList = props.messageList
      data.conversation = props.conversation
      data.needTyping = props.needTyping
    })
    const conversationID = computed(() => {
      const { conversation }: any = data
      return conversation?.conversationID ? conversation.conversationID : ''
    })
    const { conversation }: any = data
    const conversationName = ref(conversation?.remark || conversation?.userProfile?.nick)

    let usetoken = useToken()
    watch(
      () => usetoken.remark,
      (newVal) => {
        conversationName.value = newVal
      },
      {
        deep: true
      }
    )
    const conversationType = computed(() => {
      const { conversation }: any = data
      return conversation?.type ? conversation?.type : ''
    })

    const title = computed(() => {
      if (data.needTyping && data.otherTypingStatus) {
        return '对方正在输入'
      }
      return conversationName?.value
    })
    const is_status = ref('')
    onUnmounted(() => {
      clearInterval(time)
    })
    // 测试
    let time: any = null
    time = setInterval(() => is_status_Fn(), 10000)
    is_status_Fn()
    function is_status_Fn() {
      if (data.conversation?.userProfile?.userID) {
        window.$chat
          .getUserStatus({ userIDList: [data.conversation?.userProfile?.userID] })
          .then((event) => dataFn(event.data.successUserList))
        window.$chat.on(window.$tx.EVENT.USER_STATUS_UPDATED, (event) => dataFn(event.data))
      }
    }

    function dataFn(list) {
      let that = list.find((item) => item.userID === data.conversation?.userProfile?.userID)
      if (that.statusType === window.$tx.TYPES.USER_STATUS_UNKNOWN) {
        is_status.value = '未知'
      } else if (that.statusType === window.$tx.TYPES.USER_STATUS_ONLINE) {
        is_status.value = '在线'
      } else if (that.statusType === window.$tx.TYPES.USER_STATUS_OFFLINE) {
        is_status.value = '离线'
      } else if (that.statusType === window.$tx.TYPES.USER_STATUS_UNLOGINED) {
        is_status.value = '未登录'
      }
    }

    const onTyping = (inputContentEmpty: boolean, inputBlur: boolean) => {
      if (!data.needTyping || conversationType.value !== 'C2C') return
      if (new Date().getTime() / 1000 - data.lastOtherMessageTime < 30) {
        data.timeValid = 1
      }
      if (!data.timeValid) return
      if (!inputContentEmpty && !inputBlur) {
        data.myTypingStatus = 1
        const now = new Date().getTime()
        if (now - data.lastMyTypingTime > 4000) {
          data.lastMyTypingTime = now
          sendTypingMessage(data.myTypingStatus)
        }
      } else {
        data.myTypingStatus = 0
        data.lastMyTypingTime = 0
        sendTypingMessage(data.myTypingStatus)
      }
    }

    watch(conversationID, (newVal: any, oldVal: any) => {
      if (newVal === oldVal) return
      data.needTyping = false
      data.timeValid = 0
    })

    watch(
      () => data.needTyping,
      (newVal: any, oldVal: any) => {
        if (!newVal) {
          data.myTypingStatus = 0
          data.otherTypingStatus = 0
          data.lastOtherMessageTime = 0
        }
      }
    )

    watch(
      () => data.messageList,
      (newVal: any, oldVal: any) => {
        nextTick(() => {
          if (newVal.length === 0 || conversationType.value !== 'C2C') {
            return
          }
          data.lastOtherMessageTime = getLastOtherMessageTime(newVal)
          if (newVal[newVal.length - 1]?.flow === 'in') {
            if (!isTypingMessage(newVal[newVal.length - 1])) {
              data.lastOtherMessageTime = newVal[newVal.length - 1]?.time
              data.otherTypingStatus = 0
            } else {
              data.otherTypingStatus = handleTypingMessageStatus(newVal[newVal.length - 1])
              waitTypingEnd()
            }
          }
        })
      },
      { deep: true }
    )

    const handleTypingMessageStatus = (item: any) => {
      try {
        const { typingStatus, actionParam }: any = JSONToObject(item?.payload?.data)
        if (typingStatus === 1 && actionParam === constant.typeInputStatusIng) {
          return 1
        }
        return 0
      } catch {
        return 0
      }
    }

    const sendTypingMessage = (isTyping: any) => {
      data.options = {
        data: {
          businessID: constant.typeUserTyping,
          typingStatus: isTyping ? 1 : 0,
          version: 1,
          userAction: isTyping ? 14 : 0,
          actionParam: isTyping ? constant.typeInputStatusIng : constant.typeInputStatusEnd
        },
        description: '',
        extension: ''
      }
      TypingHeader.TUIServer.sendTypingMessage(data.options)
      return
    }

    const getLastOtherMessageTime = (messageList: any) => {
      if (!messageList) return 0
      for (let i = messageList.length - 1; i >= 0; i--) {
        if (!isTypingMessage(messageList[i]) && messageList[i].flow === 'in') {
          return messageList[i].time
        }
      }
      return 0
    }

    const debounce = (func: any, wait = 2000) => {
      let timer: any
      return function () {
        if (timer) clearTimeout(timer)
        timer = setTimeout(func, wait)
      }
    }

    const waitTypingEnd = debounce(() => {
      data.otherTypingStatus = 0
    }, 5000)

    return {
      ...toRefs(data),
      is_status,
      conversationID,
      conversationName,
      conversationType,
      title,
      isTypingMessage,
      sendTypingMessage,
      handleTypingMessageStatus,
      getLastOtherMessageTime,
      debounce,
      waitTypingEnd,
      onTyping
    }
  }
})
export default TypingHeader
</script>
<style scoped>
@import url('../../../../styles/common.scss');
@import url('../../../../styles/icon.scss');
h1 {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
