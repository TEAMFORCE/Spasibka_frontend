<template>
  <Transition name="fade" mode="out-in">
    <div class="image_popup_wrapper" @click.self="close" v-if="popupVisible">
      <div
        class="image_popup_content"
        :class="{ noButtons: !showChangeButtons }"
      >
        <button
          class="change_photo_button"
          @click="prevImage"
          v-if="showChangeButtons"
        >
          <PrevPictureArrowIcon />
        </button>
        <img class="image_popup_current_img" :src="getCurrentImage()" alt="" />
        <button
          class="change_photo_button"
          @click="nextImage"
          v-if="showChangeButtons"
        >
          <NextPictureArrowIcon />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script>
import { SERVER_IP } from "@/constants/api";
import PrevPictureArrowIcon from "../Icons/MarketIcons/PrevPictureArrowIcon.vue";
import NextPictureArrowIcon from "../Icons/MarketIcons/NextPictureArrowIcon.vue";

export default {
  name: "ImagePopup",
  components: {
    PrevPictureArrowIcon,
    NextPictureArrowIcon,
  },
  props: {
    images: {
      required: true,
    },
  },
  data() {
    return {
      popupVisible: false,
      currentImage: 0,
    };
  },
  computed: {
    showChangeButtons() {
      if (this.images.length > 1 && typeof this.images !== "string") {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    close() {
      this.popupVisible = false;
    },
    open() {
      this.popupVisible = true;
    },
    getCurrentImage() {
      return (
        SERVER_IP +
        this.images[this.currentImage].link.replace("?thumbnail=1", "")
      );
    },
    prevImage() {
      this.currentImage--;
      if (this.currentImage < 0) {
        this.currentImage = this.images.length - 1;
      }
    },
    nextImage() {
      this.currentImage++;
      if (this.currentImage >= this.images.length) {
        this.currentImage = 0;
      }
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
.image_popup_wrapper {
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
.image_popup_content {
  /* background-color: rgba(0, 0, 0, 0.2); */
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  height: 100%;
  margin: 0 16px;
  max-width: 938px;
  max-height: 600px;
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.noButtons {
  justify-content: center;
}
.change_photo_button {
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
}
.next_picture_arrow_icon {
  margin: 0 0 0 4px;
}
.prev_picture_arrow_icon {
  margin: 0 4px 0 0;
}
.image_popup_current_img {
  max-width: 700px;
  max-height: 500px;
  border-radius: 10px;
}
</style>