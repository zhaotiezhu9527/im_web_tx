<template>
  <div class="home-TUIKit-main">
    <div class="conversation">
      <TUISearch class="search" />
      <TUIConversation @current="handleCurrentConversation" />
    </div>
    <div class="chat">
      <TUIChat> 123</TUIChat>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { TUIEnv } from '@/TUIKit/TUIPlugin'

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
<style lang="scss">
.home-TUIKit-main {
  display: flex;
}
.search {
  padding: 12px;
}
.conversation {
  min-width: 285px;
  flex: 0 0 24%;
  border-right: 1px solid #f4f5f9;
}
.chat {
  flex: 1;
  height: 100%;
  position: relative;
}
</style>
