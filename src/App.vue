<template>
  <router-view />
</template>

<script setup></script>
<style lang="scss">
html,
body {
  background-color: #d8dee5;
}
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
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
}
.ant-select-selector,
.ant-input-password,
.ant-input {
  border-radius: 0 !important;
}
.home-main {
  display: flex;
  height: 100%;
  width: calc(100% - 60px);
  .conversation {
    width: 250px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    border-right: 1px solid #e8e8e8;
  }
}
.modalInfo {
  .ant-modal-content {
    width: 352px;
    border-radius: 0 !important;
    padding: 0 !important;
    .header {
      background: url(@/assets/img.png) no-repeat;
      background-size: 100% 100%;
      padding: 0 30px;
      height: 100px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .icon-sandian1 {
      position: absolute;
      cursor: pointer;
      right: 10px;
      top: 10px;
      color: #fff;
    }
  }
}
.tooltip {
  .li {
    color: #212112 !important;
    margin: 6px;
    font-size: 13px;
    letter-spacing: 1px;
    cursor: pointer;
    &:hover {
      color: #0052d9 !important;
    }
  }
}
</style>
