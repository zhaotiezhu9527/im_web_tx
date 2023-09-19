import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia'
import api from './config/api'
import router from './router'

import { message } from 'ant-design-vue'

const app = createApp(App)

window.$message = message
window.$api = api

app.use(createPinia())
app.use(Antd)
app.use(router)
app.mount('#app')
export { app }
