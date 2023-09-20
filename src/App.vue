<template>
  <router-view />
</template>

<script setup></script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    PingFang SC,
    Hiragino Sans GB,
    Microsoft YaHei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif,
    Apple Color Emoji,
    Segoe UI Emoji,
    Segoe UI Symbol;
}
.app {
  width: 1100px;
  height: 742px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
}
.ant-select-selector,
.ant-input-password,
.ant-input {
  border-radius: 4px !important;
}
</style>
