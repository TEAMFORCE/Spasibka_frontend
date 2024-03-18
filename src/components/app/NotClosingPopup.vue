<template>
  <Transition name="fade" mode="out-in">
    <div class="not_closing_popup_wrapper" v-if="popupVisible">
      <div class="not_closing_popup_content">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "NotClosingPopup",
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
.not_closing_popup_wrapper {
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
.not_closing_popup_content {
  background-color: var(--generalColorWhite);
  border-radius: 24px;
  padding: 32px 3px 32px 32px;
  width: 100%;
  max-height: 88%;
  margin: 0 16px;
  max-width: 542px;
  position: relative;
  z-index: 100;
  box-sizing: border-box;
  overflow-x: auto;
  scrollbar-gutter: stable;
}
.not_closing_popup_content::-webkit-scrollbar {
  width: 30px;
}
.not_closing_popup_content::-webkit-scrollbar-thumb {
  background: var(--generalBrand);
  background-clip: content-box;
  border: 12px solid transparent;
  border-radius: 20px;
}
</style>