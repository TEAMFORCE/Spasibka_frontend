<template>
  <div class="photo_cropper_wrapper">
    <div class="_cropper_wrapper">
      <h1 class="cropper_title">
        {{ $t("profile.cropperTitle") }}
      </h1>
      <cropper
        class="photo_cropper"
        :stencil-component="$options.components.CircleStencil"
        :stencil-props="{
          aspectRatio: 1 / 1,
        }"
        :src="photo"
        @change="change"
      />
      <p class="cropper_description">
        {{ $t("profile.cropperDescription") }}
      </p>
      <div class="cropper_buttons">
        <button
          class="crop_photo_approve"
          @click="$emit('cropPhoto', croppedPhoto)"
        >
          {{ $t("profile.cropperCropp") }}
        </button>
        <button class="crop_photo_cancel" @click="$emit('cropCancel')">
          {{ $t("profile.cropperCancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { CircleStencil, Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  name: "PhotoCropper",
  props: {
    photo: {
      required: true,
    },
  },
  components: {
    CircleStencil,
    Cropper,
  },
  data() {
    return {
      croppedPhoto: null,
    };
  },
  methods: {
    change({ canvas }) {
      let dataURL = canvas.toDataURL();
      this.srcToFile(dataURL, "photo.png", "image/png").then((file) => {
        this.croppedPhoto = file;
      });
    },
    srcToFile(src, fileName, mimeType) {
      return fetch(src)
        .then(function (res) {
          return res.arrayBuffer();
        })
        .then(function (buf) {
          return new File([buf], fileName, { type: mimeType });
        });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");

.photo_cropper_wrapper {
  position: fixed;
  z-index: 1000;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
}
._cropper_wrapper {
  max-width: 702px;
  max-height: 656px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  background-color: var(--generalColorWhite);
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  padding: 32px;
  box-sizing: border-box;
}
.cropper_title {
  font-size: 28px;
  font-family: "Golos";
}
.photo_cropper {
  max-height: 400px;
  max-width: 400px;
  width: 100%;
  height: 100%;
  z-index: 5;
}
.cropper_description {
  font-size: 16px;
  font-weight: 400;
  font-family: "SF Pro Text";
  color: var(--generalColorSecondary);
}
.cropper_buttons {
  width: 100%;
  display: flex;
  gap: 12px;
}
.crop_photo_approve {
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  width: 50%;
  height: 56px;
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
.crop_photo_cancel {
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  width: 50%;
  height: 56px;
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
}
</style>