<template>
  <div
    class="create_challenge_template_categories_navigation"
  >
    <button
      v-for="tab in categoriesNavigationTabs"
      @click="selectTab(tab)"
      :class="{ selected: challengeTemplatesStore.selectedCategoryNavigationTab?.name == tab.name }"
      class="create_challenge_template_categories_navigation_tab general-white-bg general-contrast-color"
    >
      {{ tab.name }}
    </button>

  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useStore as useChallengeTemplatesStore } from '@/store/ChallengeTemplatesStore/index';
import { useStore as useProfileStore } from '@/store/profile';

export default {
  name: "CreateChallengeTemplateCategoriesNavigation",
  data(){
    return {

    }
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
    ...mapStores(useProfileStore),
    role(){
      if (this.profileStore?.profileInfo?.superuser) return 2;
      else {
        let rolesList = this.profileStore?.profileInfo?.privileged;
        for (let i = 0; i < rolesList?.length; ++i){
          if (rolesList[i].role_name === "Администратор") return 1;
        }
        return 0;
      }
    },
    categoriesNavigationTabs(){
      let navigationTabs = this.challengeTemplatesStore.categoriesNavigationTabs;
      navigationTabs.splice(this.role + 1);
      return navigationTabs;
    }
  },
  methods: {
    selectTab(tab){
      this.challengeTemplatesStore.selectedCategoryNavigationTab = tab;
      this.challengeTemplatesStore.getCategoriesList();
    }
  }
}
</script>

<style scoped>
.create_challenge_template_categories_navigation {
  display: flex;
  gap: 8px;
}
.create_challenge_template_categories_navigation_tab {
  border-radius: 12px;
  padding: 8px 14px;
  font-family: 'SF Pro Text';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02), 0px 8px 24px 2px rgba(74, 77, 69, 0.12);}
.create_challenge_template_categories_navigation_tab.selected {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02), 0px 8px 24px 2px rgba(74, 77, 69, 0.12);
}
</style>