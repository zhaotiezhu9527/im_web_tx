import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import { app } from '@/main.js'
import { TUIComponents, TUICore } from '@/TUIKit'
import { TUICallKit } from '@tencentcloud/call-uikit-vue'
import TencentCloudChat from '@tencentcloud/chat'
import TIMUploadPlugin from 'tim-upload-plugin'
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin'
import { message } from 'ant-design-vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/password',
    name: 'password',
    component: () => import('@/views/password.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/user.vue')
  },
  {
    path: '/friend',
    name: 'friend',
    component: () => import('@/views/friend.vue')
  },
  {
    path: '/add',
    name: 'add',
    component: () => import('@/views/add.vue')
  },
  {
    path: '/newfriend',
    name: 'newfriend',
    component: () => import('@/views/newfriend.vue')
  },
  {
    path: '/black',
    name: 'black',
    component: () => import('@/views/black.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const WHILE_LIST = ['/login', '/register']
router.beforeEach((to, from, next) => {
  let token = Cookies.get('token')
  if (!WHILE_LIST.includes(to.path) && !token) {
    router.push('/login')
  } else if (WHILE_LIST.includes(to.path) || window.$chat) {
    next()
  } else {
    login_im_fn(next)
  }
})

function login_im_fn(next) {
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

    // 监听会话未读总数
    let onTotalUnreadMessageCountUpdated = function ({ data }) {
      window.$msgCount = data
    }
    window.$chat.on(
      window.$tx.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED,
      onTotalUnreadMessageCountUpdated
    )

    // 监听好友申请未读总数
    window.$chat.on(window.$tx.EVENT.FRIEND_APPLICATION_LIST_UPDATED, (event) => {
      // unreadCount - 好友申请的未读数
      const { unreadCount } = event.data
      window.$unreadCount = unreadCount
    })
    // 获取总的消息
    window.$msgCount = chat.getTotalUnreadMessageCount()

    //用户被踢下线时触发
    chat.on(window.$tx.EVENT.KICKED_OUT, ({ data }) => {
      if (
        [
          window.$tx.TYPES.KICKED_OUT_MULT_ACCOUNT,
          window.$tx.TYPES.KICKED_OUT_MULT_DEVICE
        ].includes(data.type)
      ) {
        message.error('账号异地登录，已退出')
      } else if (data.type === window.$tx.KICKED_OUT_USERSIG_EXPIRED) {
        message.error('签名过期')
      } else {
        message.error('REST API kick 接口踢出')
      }
      window.$api.get_logout().then(() => {
        Cookies.remove('token')
        Cookies.remove('userID')
        Cookies.remove('usersig')
        window.$chat
          .logout()
          .then(() => {})
          .catch(function (imError) {
            window.$message.error(imError.message)
          })
        router.push('/login')
      })
    })

    // 网络状态
    chat.on(window.$tx.EVENT.NET_STATE_CHANGE, ({ data }) => {
      if (data.state === window.$tx.TYPES.NET_STATE_CONNECTING) {
        message.info('网络正在连接~')
      } else if (data.state === window.$tx.TYPES.NET_STATE_DISCONNECTED) {
        message.error('网络已断开~')
      }
    })
    next()
  })
  app.use(TUIKit)
}

export default router
