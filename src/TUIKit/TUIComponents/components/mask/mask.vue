<template>
  <div class="mask" @click.self="toggleView" v-if="show">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watchEffect, toRefs } from 'vue'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props: any, ctx: any) {
    const data = reactive({
      show: false
    })

    watchEffect(() => {
      data.show = props.show
    })

    const toggleView = () => {
      data.show = !data.show
      ctx.emit('update:show', data.show)
    }

    return {
      ...toRefs(data),
      toggleView
    }
  }
})
</script>

<style lang="scss" scoped>
@import url('../../styles/common.scss');
@import url('../../styles/icon.scss');
.mask {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 99;
  background: rgba(#000000, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  main {
    position: relative;
  }
}
</style>
