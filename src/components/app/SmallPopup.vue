 <template>
  <Transition name="fade" mode="out-in">
    <div class="base_popup_wrapper" @click.self="close" v-if="popupVisible">
      <div 
        :style="{ maxWidth: maxWidth ? maxWidth : '480px' }"
        class="base_popup_content"
      >
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "BaseSmallPopup",
  props: {
    maxWidth: {
      default: null
    }
  },
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
  z-index: 9999;
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
  max-height: 90%;
  max-width: 480px;
  position: relative;
  z-index: 100;
  overflow-y: auto;
}
.base_popup_content::-webkit-scrollbar {
  width: 30px;
}

.base_popup_content::-webkit-scrollbar-thumb {
  background: var(--generalBrand);
  background-clip: content-box;
  border: 12px solid transparent;
  border-radius: 20px;
}
</style>