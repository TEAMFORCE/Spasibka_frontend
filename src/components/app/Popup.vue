<template>
  <Transition name="fade" mode="out-in">
    <div class="base_popup_wrapper" @click.self="close" v-if="popupVisible">
      <div class="base_popup_content">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "BasePopup",
  data() {
    return {
      popupVisible: false,
    };
  },
  methods: {
    close() {
      this.popupVisible = false;
    },
    open() {
      this.popupVisible = true;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.base_popup_wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(12px);
}
.base_popup_content {
  background-color: var(--generalColorWhite);
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  margin: 0 16px;
  max-width: 938px;
  position: relative;
  z-index: 100;
}
</style>