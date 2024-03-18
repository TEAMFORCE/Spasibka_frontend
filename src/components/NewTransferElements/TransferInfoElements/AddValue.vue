<template>
  <div class="add_value">
    <h1 class="input_field_description general-secondary-color">
      {{ $t("new_transfer.add_value") }}
    </h1>
    <div class="selected_tags_list">
      <button
        class="particular_selected_tag"
        :class="{
          'general-brand-bg': tag.selected,
          'transparent-bg': !tag.selected,
        }"
        v-for="tag in tagsList"
        @click="toggleTag(tag)"
        :key="tag.id"
      >
        <div
          class="tag_icon_wrapper general-white-bg"
          :class="{ 'brand-secondary-bg': tag.selected }"
        >
          <img
            :src="getImageURL('NewTransferImages', tag.image + '.png')"
            class="remove_tag_icon"
          />
        </div>
        <h1
          class="particular_selected_tag_text general-contrast-color"
          :class="{ 'general-white-color': tag.selected }"
        >
          {{ tag.name }}
        </h1>
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { getImageURL } from "@/general-scripts/get-image-url";
import { mapStores } from "pinia";
import { useStore as useNewTransferStore } from "@/store/NewTransferStore/index.js";

export default {
  name: "AddValue",
  data() {
    return {
      tagsList: [],
    };
  },
  mounted() {
    this.getTagsList();
  },
  computed: {
    ...mapStores(useNewTransferStore),
  },
  methods: {
    getImageURL: getImageURL,
    toggleTag(tag) {
      tag.selected = !tag.selected;
      this.newTransferStore.selectedTags = this.tagsList.filter(
        (t) => t.selected
      );
    },
    tagImage(tag) {
      const tagImages = {
        Клиентоориентированность: "ClientFocus",
        Этичность: "Ethics",
        Инновационность: "Innovativeness",
        Доверие: "Trust",
        Целеустремленность: "Purposefulness",
        Целенаправленность: "PurposeDirectedness",
        "Высокое качество": "HighQuality",
        "Командная работа": "Teamwork",
        Ответственность: "Responsibility",
      };
      return tagImages[tag.name] || "HighQuality";
    },
    async getTagsList() {
      try {
        let response = await axios.get(API_URIS.getTags);
        if (response?.data?.tags) {
          this.tagsList = response.data.tags.map((tag) => ({
            id: tag.id,
            image: this.tagImage(tag),
            name: tag.name,
            selected: false,
          }));
        }
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.add_value {
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
.selected_tags_list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.particular_selected_tag {
  border-radius: 12px;
  gap: 6px;
  padding: 4px;
  padding-right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--generalBrand);
}

.particular_selected_tag_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  word-break: break-word;
  color: var(--generalContrast);
}
.tag_icon_wrapper {
  padding: 4px;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.remove_tag_icon {
  height: 12px;
  width: 12px;
}

.anonymous_transfer {
  display: flex;
  height: 22px;
  gap: 8px;
}
</style>