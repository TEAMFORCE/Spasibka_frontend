<template>
  <div class="challenge_cover_loader_wrapper">
    <Transition name="fade" mode="out-in">
      <ChallengePreviewCropper
        v-if="cropperVisible"
        @imageCrooped="imageCrooped"
        @cropCancel="cropCancel"
        :image="newCover"
        :descriptionText="this.$t('challenges.cropperDescription')"
      />
    </Transition>
    <div class="no_images_wrapper" v-if="incomingPhotos.length">
      <SlickList
        class="cover_loader_images_wrapper"
        v-model:list="incomingPhotos"
        @sort-end="sortEnded"
      >
        <SlickItem
          class="_image_wrapper"
          v-for="(image, index) in incomingPhotos"
          :index="index"
        >
          <div class="_image_cover"></div>
          <img
            v-if="image?.url"
            class="cover_loader_image"
            :src="image.url"
            :alt="image.name"
          />
          <img
            v-if="image?.img"
            class="cover_loader_image"
            :src="getImg(image?.img)"
            alt="uploaded image"
          />
          <CloseImageIcon
            v-if="image?.img || image?.url"
            :currentColor="getIconColor()"
            @click="deleteFromReceivedImages(index, image)"
          />
        </SlickItem>
      </SlickList>
      <label for="cover_loader">
        <div class="cover_loader_label">
          <SelectChallengeCoverIcon />
        </div>
      </label>
    </div>
    <div class="has_images_wrapper" v-else>
      <label for="cover_loader">
        <div class="cover_loader_label_big">
          <SelectChallengeCoverIcon class="cover_icon" />
          <h1 class="cover_loader_text general-brand-color">
            {{ buttonText }}
          </h1>
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
import { SERVER_IP } from "@/constants/api";

import SelectChallengeCoverIcon from "@/components/Icons/ChallengesIcons/SelectChallengeCoverIcon.vue";
import CloseImageIcon from "@/components/Icons/closeImage.vue";
import ChallengePreviewCropper from "@/components/ChallengeItemElements/ChallengePreviewCropper.vue";

import { SlickList, SlickItem } from "vue-slicksort";

export default {
  name: "ChallengeCoverLoader",
  components: {
    SelectChallengeCoverIcon,
    CloseImageIcon,
    SlickList,
    SlickItem,
    ChallengePreviewCropper,
  },
  props: {
    photos: {
      default: null,
    },
    buttonText: {
      default: "",
    },
    templatePhotos: {
      default: [],
    },
  },
  data() {
    return {
      fileListForSend: [],
      allowedFileExtensions: ["image/jpg", "image/jpeg", "image/png"],
      incomingPhotos: [],
      newImageIsLoaded: false,

      cropperVisible: false,

      coverImageChanged: false,

      newCover: null,
    };
  },
  methods: {
    setIncomingPhotos() {
      if (typeof this.photos == "string") {
        this.incomingPhotos.push({
          img: this.photos,
        });
      } else if (typeof this.photos !== "string" && this.photos !== null) {
        for (let i = 0; i < this.photos.length; i++) {
          this.incomingPhotos.push({
            img: this.photos[i],
          });
        }
      }
      this.createArray();
    },
    getImg(url) {
      if (url) {
        return `${SERVER_IP}${url}`;
      }
    },
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    openCropper() {
      this.cropperVisible = true;
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
      setTimeout(() => {
        this.incomingPhotos = this.incomingPhotos.filter(
          (el) => el !== undefined
        );
      }, 100);
      setTimeout(() => {
        this.createArray();
      }, 150);
    },
    handleFileChange(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith("image/")) {
          continue;
        }
        const reader = new FileReader();
        reader.onload = () => {
          this.fileListForSend.push(files[i]);
          this.incomingPhotos.push({
            name: files[i].name,
            url: reader.result,
            imageIndex: i,
          });
        };
        reader.readAsDataURL(files[i]);
        this.newImageIsLoaded = true;
      }
      setTimeout(() => {
        this.createArray();
      }, 300);
      setTimeout(() => {
        event.target.value = "";
      }, 400);
    },
    checkToCropper() {
      if (
        this.incomingPhotos.length &&
        this.photos &&
        this.photos[0] !== this.incomingPhotos[0].img &&
        !this.incomingPhotos[0].name
      ) {
        this.coverImageChanged = true;
        this.createFile();
        setTimeout(() => {
          this.$emit("coverImageChanged");
        }, 100);
      } else if (this.incomingPhotos.length && this.incomingPhotos[0]?.name) {
        let file = this.fileListForSend.find(
          (el) => el.name == this.incomingPhotos[0].name
        );
        this.newCover = file;
        setTimeout(() => {
          this.$emit("coverImageChanged");
        }, 100);
      }
    },
    async createFile() {
      if (!this.incomingPhotos.length) {
        return null;
      } else if (this.incomingPhotos[0].img) {
        await fetch("/api" + this.incomingPhotos[0].img)
          .then((response) => response.blob())
          .then((imageBlob) => {
            const file = new File([imageBlob], "imageForCropp.jpg", {
              type: imageBlob.type,
            });
            this.newCover = file;
          });
      }
    },
    createArray() {
      let sortIndex = 1;
      const regex = /\/(\d+)\/$/;
      let fileListSort = [];
      for (let i = 0; i < this.incomingPhotos.length; i++) {
        if (this.incomingPhotos[i].img) {
          fileListSort.push({
            index: Number(this.incomingPhotos[i].img.match(regex)[1]),
            sortIndex: sortIndex++,
          });
        } else if (this.incomingPhotos[i].url) {
          fileListSort.push({
            filename: this.incomingPhotos[i].name,
            sortIndex: sortIndex++,
          });
        }
      }
      this.checkToCropper();

      this.$emit("fileListSort", fileListSort);
      this.$emit("fileListForSend", this.fileListForSend);
    },
    deleteFromReceivedImages(index, image) {
      this.incomingPhotos.splice(index, 1);
      if (this.newImageIsLoaded) {
        this.deleteFromFileList(image);
      }
      setTimeout(() => {
        this.createArray();
      }, 150);
    },
    deleteFromFileList(image) {
      this.fileListForSend = this.fileListForSend.filter(
        (el) => el.imageIndex !== image.imageIndex
      );
    },
    async createFileForTemplate(photo) {
      await fetch("/api" + photo)
        .then((response) => response.blob())
        .then((imageBlob) => {
          const file = new File([imageBlob], "createdImage.jpg", {
            type: imageBlob.type,
          });
          this.fileListForSend.push(file);
        });
    },
    async setFilesForTemplate() {
      for (let i = 0; i < this.templatePhotos.length; i++) {
        await this.createFileForTemplate(this.templatePhotos[i]);
      }
    },
  },
  mounted() {
    this.setIncomingPhotos();
    setTimeout(() => {
      if (this.templatePhotos?.length) {
        this.setFilesForTemplate();
      }
    }, 100);
  },
};
</script>

<style >
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.challenge_cover_loader_wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.cover_loader_label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 54px;
  height: 54px;
  border-radius: 12px;
  border: 1px solid var(--generalBrand);
  gap: 8px;
}
.no_images_wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
.cover_loader_images_wrapper {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.cover_loader_text {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
}
._image_cover {
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
._image_wrapper {
  height: 56px;
  width: auto;
  position: relative;
  z-index: 9999;
}
._image_wrapper:hover ._image_cover {
  opacity: 0.2;
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
.cover_loader_image {
  height: 56px;
  width: auto;
  border-radius: 6px;
}
.cover_loader_input {
  display: none;
}
.has_images_wrapper {
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
  gap: 8px;
}
.cover_icon {
  height: 24px;
  width: 24px;
}
</style>