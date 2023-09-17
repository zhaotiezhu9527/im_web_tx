import { createApp } from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia'
import api from '../config/api'
import router from './router'

import { TUIComponents, TUICore, genTestUserSig } from './TUIKit'
import { TUICallKit } from '@tencentcloud/call-uikit-vue'

const SDKAppID = 20004058
const secretKey = '2042224864d907f19457c06f97400eddfbea46bea784c455ebb023543c9bf82d' //Your secretKey
const userID = 'test01'

const TUIKit = TUICore.init({
  SDKAppID
})
TUIKit.use(TUIComponents)
TUIKit.use(TUICallKit)

TUIKit.login({
  userID: userID,
  userSig: genTestUserSig({
    SDKAppID,
    secretKey,
    userID
  }).userSig
})

const app = createApp(App)

app.config.globalProperties.$api = api
app.use(TUIKit)
app.use(createPinia())
app.use(Antd)
app.use(router)
app.mount('#app')
export { app }
