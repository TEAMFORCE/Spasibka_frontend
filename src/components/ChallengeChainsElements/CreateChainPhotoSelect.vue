<template>
  <div class="create_challenge_photos_wrapper">
    <SlickList
      v-if="challengePhotosLink?.length"
      class="photos_list_wrapper"
      v-model:list="challengePhotosLink"
      @sort-end="sortEnded"
    >
      <SlickItem
        class="_photo_wrapper"
        v-for="(image, index) in challengePhotosLink"
        :index="index"
      >
        <div v-if="image?.url" class="_photo_cover" />
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
    <label 
      for="cover_loader"
      :class="{ no_photos: !challengePhotosLink?.length }"
    >
      <div 
        class="cover_loader_label"
        :class="{ no_photos: !challengePhotosLink?.length }"
      >
        <SelectChallengeCoverIcon />
        <h1
          v-if="!challengePhotosLink?.length"
          class="cover_loader_text general-brand-color"
        >
          {{ $t("challenges.challenge_chains.chain_covers") }}
        </h1>
      </div>
    </label>
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
import SelectChallengeCoverIcon from "@/components/Icons/ChallengesIcons/SelectChallengeCoverIcon.vue";
import CloseImageIcon from "@/components/Icons/closeImage.vue";

import { SlickList, SlickItem } from "vue-slicksort";

export default {
  name: "CreateChallengePhotoSelect",
  components: {
    SelectChallengeCoverIcon,
    CloseImageIcon,
    SlickList,
    SlickItem,
  },
  data() {
    return {
      allowedFileExtensions: ["image/jpg", "image/jpeg", "image/png"],
      challengePhotos: [],
      challengePhotosLink: [],
    };
  },
  methods: {
    refreshImages() {
      setTimeout(() => {
        this.challengePhotosLink = this.challengePhotosLink.filter(
          (el) => el !== undefined
        );
        if (
          this.challengePhotosLink.length > 1 &&
          this.challengePhotos.length > 1
        ) {
          let sortedChallengePhotos = this.challengePhotosLink.map((item) => {
            const { name } = item;
            return this.challengePhotos.find((item) => item.name === name);
          });
          this.challengePhotos = sortedChallengePhotos;
        }
        this.$emit("imagesRefreshed", this.challengePhotos);
      }, 150);
    },
    removeImageFromList(index) {
      this.challengePhotos.splice(index, 1);
      this.challengePhotosLink.splice(index, 1);
      this.$emit("imagesRefreshed", this.challengePhotos);
    },
    sortEnded() {
      this.refreshImages();
    },
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    deleteFromImageList(index) {
      this.removeImageFromList(index);
    },
    handleFileChange(event) {
      let files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith("image/")) {
          continue;
        }
        const reader = new FileReader();
        reader.onload = () => {
          this.challengePhotos.push(files[i]);
          this.challengePhotosLink.push({
            name: files[i]?.name,
            url: reader.result,
          });
          this.$emit("imagesRefreshed", this.challengePhotos);
        };
        reader.readAsDataURL(files[i]);
        setTimeout(() => {
          event.target.value = "";
        }, 300);
      }
    },
  },
};
</script>

<style scoped>
.create_challenge_photos_wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
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
._photo_wrapper:hover ._photo_cover {
  opacity: 0.2;
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
.cover_loader {
  width: 54px;
  height: 54px;
  box-sizing: border-box;
}
.cover_loader_label {
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  width: 54px;
  height: 54px;
  border-radius: 12px;
  border: 1px solid var(--generalBrand);
  gap: 8px;
}
.cover_loader_text {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
}
.no_photos {
  width: 100%;
}
.clip_icon {
  margin: 6px 0 0 0;
}
.cover_loader_input {
  display: none;
}
</style>