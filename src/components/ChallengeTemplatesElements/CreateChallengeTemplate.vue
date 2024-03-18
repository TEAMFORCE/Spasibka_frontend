<template>
  <div class="create_challenge_template_wrapper">
    <CreateChallengeTemplateSettings
      v-show="challengeTemplatesStore.openedTab === 'settings'"
    />
    <CreateChallengeTemplateInputs
      v-show="challengeTemplatesStore.openedTab === 'inputs'"
    />
    <CreateChallengeTemplatesCategories
      v-show="challengeTemplatesStore.openedTab === 'categories'"
    />
    <CategoryDeletion
      v-show="challengeTemplatesStore.openedTab === 'delete_category'"
    />
    <CategoryAddition
      v-show="challengeTemplatesStore.openedTab === 'add_category'"
    />
  </div>
</template>

<script>
import CreateChallengeTemplateInputs from "./CreateChallengeTemplateElements/CreateChallengeTemplateInputs.vue";
import CreateChallengeTemplateSettings from "./CreateChallengeTemplateElements/CreateChallengeTemplateSettings.vue";
import CreateChallengeTemplatesCategories from "./CreateChallengeTemplateElements/CreateChallengeTemplatesCategories.vue";
import CategoryDeletion from "./CreateChallengeTemplateElements/CategoryDeletion.vue";
import CategoryAddition from "./CreateChallengeTemplateElements/CategoryAddition.vue";

import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";

export default {
  name: "CreateChallengeTemplate",
  components: {
    CreateChallengeTemplateInputs,
    CreateChallengeTemplateSettings,
    CreateChallengeTemplatesCategories,
    CategoryDeletion,
    CategoryAddition,
  },
  data() {
    return {};
  },
  watch: {
    "challengeTemplatesStore.selectedCategoryNavigationTab": {
      handler() {
        this.challengeTemplatesStore.selectedCategoriesList = [];
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
  },
};
</script>

<style scoped>
.create_challenge_template_wrapper {
  position: fixed;
  z-index: 11;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: scroll;
  display: flex;
  /*justify-content: center;
  align-items: center; */
}
</style>