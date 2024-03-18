<template>
  <div class="create_challenge_templates_categories general-white-bg">
    <div class="header_text general-contrast-color">
      {{ $t("challenges.challenge_templates.category_management") }}
    </div>
    <CreateChallengeTemplateCategoriesNavigation/>
    <div class="top_categories_list">
      <CreateChallengeTemplateSubCategory
        v-for="category in challengeTemplatesStore.categoriesList"
        :category="category"
      />
    </div>
    <div class="action_buttons">
      <button
        class="go_back_button brand-secondary-bg general-brand-color"
        @click="goBack"
      >
        {{ $t("challenges.challenge_templates.go_back") }}
      </button>
      <button
        class="add_category_button tooltip_container brand-secondary-bg general-brand-color"
        :data-tooltip="$t('challenges.create_category')"
      >
        <AddCategoryIcon
          @click="openCategoryAddition"
          class="add_category_icon"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";

import AddCategoryIcon from '@/components/Icons/ChallengesIcons/AddCategoryIcon.vue';

import CreateChallengeTemplateCategoriesNavigation from './CreateChallengeTemplateCategoriesElements/CreateChallengeTemplateCategoriesNavigation.vue';
import CreateChallengeTemplateSubCategory from './CreateChallengeTemplateCategoriesElements/CreateChallengeTemplateSubCategory.vue';

export default {
  name: "CreateChallengeTemplateCategories",
  components: {
    CreateChallengeTemplateCategoriesNavigation,
    CreateChallengeTemplateSubCategory,
    AddCategoryIcon
  },
  data(){
    return {  
    }
  },
  mounted(){
    this.challengeTemplatesStore.getCategoriesList();
  },    
  computed: {
    ...mapStores(useChallengeTemplatesStore),
  },
  methods: {
    goBack(){
      this.challengeTemplatesStore.openedTab = "inputs";
    },
    openCategoryAddition(){
      this.challengeTemplatesStore.openedTab = "add_category";
    }
  }
}
</script>

<style scoped>
.create_challenge_templates_categories {
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
  text-align: left;
  font-family: 'Ubuntu';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.top_categories_list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.go_back_button {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  border-radius: 6px;
  padding: 16px;
  width: 50%;
}
.add_category_button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;  
  padding: 16px;
  border-radius: 6px;
}
.add_category_icon {
  height: 24px;
  width: 24px;
}
</style>