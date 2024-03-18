<template>
  <div class="challenge_preview_cropper_wrapper">
    <div class="_cropper_wrapper">
      <h1 class="cropper_title">
        {{ $t("challenges.cropperTitle") }}
      </h1>
      <Cropper
        v-if="image"
        class="image_crooper"
        :stencil-props="{
          aspectRatio: 2 / 1.3,
        }"
        :src="imageForCroop"
        @change="change"
      />
      <p class="cropper_description">
        {{ descriptionText }}
      </p>
      <div class="cropper_buttons">
        <button class="crop_photo_approve" @click="imageCrooped">
          {{ $t("challenges.cropperCropp") }}
        </button>
        <button class="crop_photo_cancel" @click="$emit('cropCancel')">
          {{ $t("challenges.cropperCancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
  name: "ChallengePreviewCropper",
  components: {
    Cropper,
  },
  props: {
    image: {
      required: true,
    },
    descriptionText: {
      require: true,
    },
  },
  data() {
    return {
      imageForCroop: null,
      croppedImage: null,
    };
  },
  methods: {
    setUrl() {
      this.imageForCroop = URL.createObjectURL(this.image);
    },
    change({ canvas }) {
      let dataURL = canvas.toDataURL();
      this.srcToFile(dataURL, "photo.jpg", "image/jpg").then((file) => {
        this.croppedImage = file;
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
    imageCrooped() {
      this.$emit("imageCrooped", this.croppedImage);
    },
  },
  mounted() {
    this.setUrl();
  },
};
</script>

<style scoped>
.challenge_preview_cropper_wrapper {
  width: 100%;
  height: 100%;
  position: fixed !important;
  top: 0;
  left: 0;
  z-index: 10000;
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
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
  justify-content: space-between;
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
.image_crooper {
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