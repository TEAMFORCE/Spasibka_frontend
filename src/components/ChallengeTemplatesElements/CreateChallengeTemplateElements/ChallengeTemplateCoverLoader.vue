<template>
  <div class="challenge_template_cover_loader_wrapper">
    <Transition name="fade" mode="out-in">
      <ChallengePreviewCropper
        v-if="cropperVisible"
        @imageCrooped="imageCrooped"
        @cropCancel="cropCancel"
        :image="challengeTemplatesStore?.challengeTemplatePhotos[0]"
        :descriptionText="this.$t('challenges.cropperDescription')"
      />
    </Transition>
    <div
      class="hasnt_images"
      v-if="!challengeTemplatesStore.challengeTemplatePhotosLink.length"
    >
      <label for="cover_loader" class="cover_loader_label_big_wrapper">
        <div class="cover_loader_label_big">
          <SelectChallengeCoverIcon />
          <h1
            v-if="!challengeTemplatesStore.challengeTemplatePhotosLink.length"
            class="cover_loader_text"
          ></h1>
          {{ $t("challenges.challenge_templates.template_cover") }}
        </div>
      </label>
    </div>
    <div v-else class="has_images">
      <SlickList
        class="photos_list_wrapper"
        v-model:list="challengeTemplatesStore.challengeTemplatePhotosLink"
        @sort-end="sortEnded"
      >
        <SlickItem
          class="_photo_wrapper"
          v-for="(
            image, index
          ) in challengeTemplatesStore.challengeTemplatePhotosLink"
          :index="index"
        >
          <div v-if="image?.url" class="_photo_cover"></div>
          <img
            v-if="image?.url"
            :src="image.url"
            :alt="image.name"
            class="_photo_item"
          />
          <CloseImageIcon
            v-if="image?.url"
            :currentColor="getIconColor()"
            @click="deleteFromImageList(index)"
          />
        </SlickItem>
      </SlickList>
      <label for="cover_loader">
        <div class="cover_loader_label">
          <SelectChallengeCoverIcon />
        </div>
      </label>
    </div>
    <input
      ref="coverLoader"
      id="cover_loader"
      class="cover_loader_input"
      type="file"
      multiple
      :accept="allowedFileExtensions"
      @change="handleFileChange"
    />
  </div>
</template>

<script>
import ChallengePreviewCropper from "@/components/ChallengeItemElements/ChallengePreviewCropper.vue";
import SelectChallengeCoverIcon from "@/components/Icons/ChallengesIcons/SelectChallengeCoverIcon.vue";
import CloseImageIcon from "@/components/Icons/closeImage.vue";

import { SlickList, SlickItem } from "vue-slicksort";

import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";

export default {
  name: "ChallengeTemplateCoverLoader",
  components: {
    ChallengePreviewCropper,
    SelectChallengeCoverIcon,
    CloseImageIcon,
    SlickList,
    SlickItem,
  },
  data() {
    return {
      allowedFileExtensions: ["image/jpg", "image/jpeg", "image/png"],
      cropperVisible: false,
    };
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
  },
  watch: {
    cropperVisible() {
      if (this.cropperVisible) {
        this.$emit("blockScroll");
      } else {
        this.$emit("unlockScroll");
      }
    },
  },
  methods: {
    openCropper() {
      setTimeout(() => {
        this.cropperVisible = true;
      }, 150);
    },
    cropCancel() {
      setTimeout(() => {
        this.cropperVisible = false;
      }, 150);
    },
    imageCrooped(file) {
      this.cropperVisible = !this.cropperVisible;
      setTimeout(() => {
        this.$emit("imageCropped", file);
      }, 100);
    },
    sortEnded() {
      this.challengeTemplatesStore.refreshImages();
    },
    deleteFromImageList(index) {
      this.challengeTemplatesStore.removeImageFromList(index);
    },
    handleFileChange(event) {
      let files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith("image/")) {
          continue;
        }
        const reader = new FileReader();
        reader.onload = () => {
          this.challengeTemplatesStore.challengeTemplatePhotos.push(files[i]);
          this.challengeTemplatesStore.challengeTemplatePhotosLink.push({
            name: files[i]?.name,
            url: reader.result,
          });
        };
        reader.readAsDataURL(files[i]);
        setTimeout(() => {
          event.target.value = "";
        }, 300);
      }
    },
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
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

.challenge_template_cover_loader_wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.hasnt_images {
  width: 100%;
}
.cover_loader_label_big_wrapper {
  width: 100%;
}
.cover_loader_label_big {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 54px;
  border-radius: 12px;
  border: 1px solid var(--generalBrand);
}
.cover_loader_text {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  color: var(--generalBrand);
}
.has_images {
  width: 100%;
  display: flex;
  gap: 8px;
}
.photos_list_wrapper {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
._photo_wrapper {
  height: 56px;
  width: auto;
  position: relative;
  z-index: 9999;
}
._photo_wrapper:hover ._photo_cover {
  opacity: 0.2;
}
._photo_cover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 6px;
  background-color: #000000;
  opacity: 0;
  transition: 0.3s;
}
._photo_item {
  height: 56px;
  width: auto;
  border-radius: 6px;
}
.close_image_icon {
  width: 10px;
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 5px;
  right: 5px;
  border-radius: 2px;
  transition: 0.3s;
  z-index: 2;
}
.close_image_icon:hover {
  transform: scale(1.2);
}
.cover_loader_label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 54px;
  height: 54px;
  border-radius: 12px;
  border: 1px solid var(--generalBrand);
}
.clip_icon {
  margin: 6px 0 0 0;
}
.cover_loader_input {
  display: none;
}
</style>