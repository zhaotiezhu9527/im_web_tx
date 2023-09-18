import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import Cookies from 'js-cookie'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia'
import api from './config/api'
import router from './router'

import { TUIComponents, TUICore } from './TUIKit'
import { TUICallKit } from '@tencentcloud/call-uikit-vue'
import TencentCloudChat from '@tencentcloud/chat'
import TIMUploadPlugin from 'tim-upload-plugin'
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin'
import { message } from 'ant-design-vue'

const app = createApp(App)
if (Cookies.get('token')) {
  const SDKAppID = 20004058
  const secretKey = Cookies.get('usersig')
  const userID = Cookies.get('userID')

  const TUIKit = TUICore.init({
    SDKAppID
  })
  TUIKit.use(TUIComponents)
  TUIKit.use(TUICallKit)

  TUIKit.login({
    userID: userID,
    SDKAppID,
    userSig: secretKey,
    useUploadPlugin: true,
    useProfanityFilterPlugin: false
  }).then(() => {
    let chat = TencentCloudChat.create({ SDKAppID })
    chat.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
    chat.registerPlugin({
      'tim-profanity-filter-plugin': TIMProfanityFilterPlugin
    })
    window.$chat = chat
    window.$tx = TencentCloudChat

    // 获取总的消息
    app.config.globalProperties.$unreadCount = chat.getTotalUnreadMessageCount()

    // 监听总信息
    let onTotalUnreadMessageCountUpdated = (event) => {
      app.config.globalProperties.$unreadCount = event.data
    }
    chat.on(
      TencentCloudChat.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED,
      onTotalUnreadMessageCountUpdated
    )

    //用户被踢下线时触发
    let onKickedOut = function (event) {
      if (
        [
          TencentCloudChat.TYPES.KICKED_OUT_MULT_ACCOUNT,
          chat.TYPES.KICKED_OUT_MULT_DEVICE
        ].includes(event.data.type)
      ) {
        message('账号异地登录，已退出')
      } else {
        message('签名过期')
      }
    }
    chat.on(TencentCloudChat.EVENT.KICKED_OUT, onKickedOut)

    // 网络状态
    let onNetStateChange = function (event) {
      if (event.data.state === TencentCloudChat.TYPES.NET_STATE_CONNECTING) {
        message('网络正在连接~')
      } else if (event.data.state === TencentCloudChat.TYPES.NET_STATE_DISCONNECTED) {
        message('网络已断开~')
      }
    }
    chat.on(TencentCloudChat.EVENT.NET_STATE_CHANGE, onNetStateChange)

    // 好友申请触发
    let onFriendApplicationListUpdated = function (event) {
      // unreadCount - 好友申请的未读数
      const { unreadCount } = event.data
      app.config.globalProperties.$unreadCount = unreadCount
    }
    chat.on(TencentCloudChat.EVENT.FRIEND_APPLICATION_LIST_UPDATED, onFriendApplicationListUpdated)
  })
  app.use(TUIKit)
}

window.$message = message
window.$api = api

app.use(createPinia())
app.use(Antd)
app.use(router)
app.mount('#app')
export { app }
