<template>
  <div v-if="items">12312321</div>
</template>
<script setup>
import { ref } from 'vue'
const items = ref('')
function open(val) {
  items.value = val
  console.log(val)
}
defineExpose({ open })
</script>
<style lang="scss" scoped></style>
