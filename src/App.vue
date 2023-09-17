<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup></script>
<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
body,
html {
  height: 100%;
  width: 100%;
}
.app {
  width: 1100px;
  height: 742px;
  border: 1px solid #000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
