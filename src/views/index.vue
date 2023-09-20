<template>
  <div class="app">
    <Menu />
    <div class="home-TUIKit-main">
      <div class="conversation">
        <TUIConversation @current="handleCurrentConversation" />
      </div>
      <div class="chat">
        <TUIChat>
          <div class="content flex justify-center items-center">
            <i class="iconfont icon-icon-test3"></i>
          </div>
        </TUIChat>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { TUIEnv } from '@/TUIKit/TUIPlugin'
import Menu from '@/components/menu.vue'
const data = reactive({
  env: TUIEnv(),
  currentModel: 'conversation',
  showCall: false,
  showCallMini: false
})
const handleCurrentConversation = (value) => {
  data.currentModel = value ? 'message' : 'conversation'
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
}
.chat {
  flex: 1;
  height: 100%;
  position: relative;
  .content {
    width: 760px;
    height: 100%;
    .iconfont {
      font-size: 200px;
      color: #eee;
    }
  }
}
</style>
