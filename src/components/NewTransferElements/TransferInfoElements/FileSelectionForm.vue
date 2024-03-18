<template>
  <div class="file_selection_form">
    <h1 class="input_field_description general-secondary-color">
      {{ $t("new_transfer.photos") }}
    </h1>
    <div class="file_names_and_selector_button">
      <div class="selected_file_names">
        {{ selectedFileNames }}
      </div>
      <input
        type="file"
        ref="fileInput"
        multiple
        @change="handleFileChange"
        style="display: none"
        accept="image/*"
      />
      <button
        class="select_files_button general-brand-bg general-white-color"
        @click="selectFiles"
      >
        {{ $t("new_transfer.select_files") }}
      </button>
      <button
        class="select_files_button_mobile general-white-bg"
        @click="selectFiles"
      >
        <img class="select_files_icon" :src="selectFilesIcon" />
        <h1 class="select_files_text general-brand-color">
          {{ $t("new_transfer.select_files") }}
        </h1>
      </button>
    </div>
    <div class="image-gallery">
      <div class="image-wrapper" v-for="(image, index) in images" :key="index">
        <img class="selected_image" :src="image.url" :alt="image.name" />
        <img
          class="remove_image"
          @click="removeImage(index)"
          :src="crossButton"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getImageURL } from "@/general-scripts/get-image-url";

import { mapStores } from "pinia";
import { useStore as useNewTransferStore } from "@/store/NewTransferStore/index.js";

export default {
  name: "FileSelectionForm",
  data() {
    return {
      images: [],
    };
  },
  watch: {
    images: {
      handler() {
        this.newTransferStore.images = this.images;
      },
      deep: true,
    },
  },
  computed: {
    ...mapStores(useNewTransferStore),
    crossButton() {
      return getImageURL("NewTransferImages", "Cross.svg");
    },
    selectFilesIcon() {
      return getImageURL("NewTransferImages", "SelectFiles.svg");
    },
    selectedFileNames() {
      if (this.images.length > 0) {
        let filesNames = "";
        for (let i = 0; i < this.images.length; ++i) {
          filesNames += this.images[i].name;
          if (i < this.images.length - 1) {
            filesNames += ", ";
          }
        }
        return filesNames;
      } else {
        return this.$t("new_transfer.select_files");
      }
    },
  },
  methods: {
    selectFiles() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith("image/")) {
          continue;
        }
        const reader = new FileReader();
        reader.onload = () => {
          this.images.push({ name: files[i].name, url: reader.result });
        };
        reader.readAsDataURL(files[i]);
      }
    },
    removeImage(index) {
      this.images.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.file_selection_form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.input_field_description {
  text-align: left;
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.file_names_and_selector_button {
  max-width: 1130px;
  position: relative;
  border-radius: 8px;
  border: 1px solid var(--neutral5);
}
.selected_file_names {
  display: flex;
  padding: 12px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  /* color: var(--generalColorSecondary); */
  font-family: "Roboto";
  font-size: 16px;
}
.select_files_button {
  position: absolute;
  right: 0px;
  top: 0px;
  border-radius: 6px;
  padding: 12px 16px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
@media (max-width: 500px) {
  .file_names_and_selector_button {
    border: none;
  }
  .select_files_button {
    display: none;
  }
  .selected_file_names {
    display: none;
  }
}
.select_files_button_mobile {
  width: 100%;
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 17px;
  border: 1px solid var(--generalBrand);
  border-radius: 12px;
}
@media (min-width: 501px) {
  .select_files_button_mobile {
    display: none;
  }
}
.select_files_icon {
  width: 24px;
  height: 24px;
}
.select_files_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
}
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.image-wrapper {
  position: relative;
  max-width: 200px;
  max-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper img {
  max-width: 100%;
  max-height: 100%;
}
.selected_image {
  filter: brightness(0.75);
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 16px;
}
.remove_image {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  height: 16px;
  width: 16px;
}
</style>