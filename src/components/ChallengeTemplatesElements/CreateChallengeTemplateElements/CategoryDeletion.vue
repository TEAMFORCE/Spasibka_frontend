<template>
  <div class="category_deletion general-white-bg">
    <div class="header_text general-contrast-color">
      {{ $t("challenges.challenge_templates.delete_category") }} 
      <span class="header_text general-brand-color">
        {{ challengeTemplatesStore.selectedCategoryForDelete?.name }}
      </span>?
    </div>
    <div class="action_buttons">
      <button
        class="action_button general-white-color general-brand-bg"
        @click="deleteCategory"
      > 
        {{ $t("challenges.challenge_templates.yes") }}
      </button>
      <button
        class="action_button brand-secondary-bg general-brand-color"
        @click="goBack"
      >
        {{ $t("challenges.challenge_templates.go_back") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import axios from 'axios';
import { API_URIS } from '@/constants/api';
import { notify } from '@/general-scripts/toast-notification';

export default {
  name: "CategoryDeletion",
  computed: {
    ...mapStores(useChallengeTemplatesStore),
  },
  methods: {
    goBack(){
      this.challengeTemplatesStore.openedTab = "categories";
    },
    async deleteCategory(){
      try {
        await axios.delete(API_URIS.templateSection + this.challengeTemplatesStore.selectedCategoryForDelete.id + "/");
        this.challengeTemplatesStore.openedTab = "categories";
        this.challengeTemplatesStore.getCategoriesList();
        notify(this.$t("challenges.challenge_templates.category_successfully_deleted"), "success");
      } catch(err) {
        notify(err?.response?.data || err?.message || this.$t("notification.error"));
        throw err;
      }
    }
  }
}
</script>

<style scoped>
.category_deletion {
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;   
  padding: 32px;
  gap: 16px;
  margin: auto;
}
.header_text {
  font-family: 'Ubuntu';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  border-radius: 6px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>