<template>
  <div class="stickers_selection">
    <h1 class="input_field_description general-secondary-color">
      {{ $t("new_transfer.stickers") }}
    </h1>
    <div class="stickerpacks_list">
      <button
        class="stickerpack_selector minor-info-secondary-bg general-contrast-color"
        v-for="stickerpack in stickerpacks"
        @click="selectStickerpack(stickerpack)"
        :class="{ selected_button: stickerpack.id == selectedStickerpack.id }"
      >
        {{ stickerpack.name }}
      </button>
    </div>
    <div class="stickers_list">
      <button
        class="sticker"
        v-for="sticker in stickersForSelectedStickerpack"
        @click="selectSticker(sticker)"
        :class="{ selected_sticker: sticker == selectedSticker }"
      >
        <img class="sticker_image" :src="photoAddress(sticker.image)" />
      </button>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";

import { photoAddress } from "@/general-scripts/photo-address.js";

import { mapStores } from "pinia";
import { useStore as useNewTransferStore } from "@/store/NewTransferStore/index.js";

export default {
  name: "StickersSelection",
  data() {
    return {
      stickerpacks: [
        {
          name: this.$t("new_transfer.stickerpacks_all"),
          id: 0,
        },
      ],
      selectedStickerpack: {
        name: this.$t("new_transfer.stickerpacks_all"),
        id: 0,
      },

      stickers: [],
      selectedSticker: null,
    };
  },
  mounted() {
    this.getStickerpacks();
    this.getStickers();
  },
  computed: {
    ...mapStores(useNewTransferStore),
    stickersForSelectedStickerpack() {
      if (this.selectedStickerpack.id == 0) {
        return this.stickers;
      }
      let stickers = [];
      for (let i = 0; i < this.stickers.length; ++i) {
        if (this.selectedStickerpack.id == this.stickers[i].stickerpackid) {
          stickers.push(this.stickers[i]);
        }
      }
      return stickers;
    },
  },
  methods: {
    photoAddress: photoAddress,
    selectStickerpack(stickerpack) {
      this.selectedStickerpack = stickerpack;
    },
    selectSticker(sticker) {
      if (this.selectedSticker == sticker) {
        this.selectedSticker = null;
      } else {
        this.selectedSticker = sticker;
      }
      this.newTransferStore.selectedSticker = this.selectedSticker;
    },
    async getStickerpacks() {
      try {
        const response = await axios.get(API_URIS.stickerpacks);
        this.stickerpacks.push(...response.data);
      } catch (err) {
        throw err;
      }
    },
    async getStickers() {
      try {
        const response = await axios.get(API_URIS.getStickers);
        this.stickers = response.data;
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.stickers_selection {
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
.stickerpacks_list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.stickerpacks_list::-webkit-scrollbar {
  width: 0;
}
.stickerpack_selector {
  border-radius: 12px;
  padding: 8px 14px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
}
.stickerpack_selector.selected_button {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
}
.stickers_list {
  display: flex;
  overflow-x: auto;
  gap: 20px;
}
.sticker {
  border-radius: 20px;
}
.sticker.selected_sticker {
  border: 3px solid var(--generalBrand);
}
.sticker_image {
  width: 267.5px;
  height: 477.16px;
  border-radius: 20px;
  object-fit: cover;
}
@media (max-width: 1440px) {
  .sticker_image {
    width: 145.5px;
    height: 281px;
  }
}
</style>