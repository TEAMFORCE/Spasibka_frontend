<template>
  <div class="category_addition general-white-bg">
    <h1 class="header_text">
      {{ $t("challenges.challenge_templates.category_addition") }}
    </h1>
    <!-- <vSelect
      v-model="selectedCategoriesList"
      :options="categoriesList"
      :placeholder="$t('challenges.challenge_templates.select_parent_categories')"
      label="name"
      taggable
      multiple
      @option:selected="deleteCategoryFromList"
      @option:deselected="addCategoryToList"
    /> -->
    <CategoryAdditionTree />
    <div class="input_field_wrapper">
      <div 
        v-if="newCategoryName"
        class="input_field_placeholder general-secondary-color general-white-bg"
      >
        {{ $t('challenges.challenge_templates.enter_category_name') }}
      </div>
      <input
        v-model="newCategoryName"
        class="new_category_name general-contrast-color"
        :placeholder="$t('challenges.challenge_templates.enter_category_name')"
      />
    </div>
    <div class="action_buttons">
      <button
        class="action_button general-white-color general-brand-bg"
        @click="addCategory"
      >
        {{ $t("challenges.challenge_templates.save_category") }}
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
import vSelect from "vue-select";
import CategoryAdditionTree from "@/components/ChallengeTemplatesElements/CreateChallengeTemplateElements/CategoryAdditionElements/CategoryAdditionTree.vue";

import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "CategoryAddition",
  components: {
    vSelect,
    CategoryAdditionTree,
  },
  data() {
    return {
      newCategoryName: "",
      allCategoriesTree: [],
      categoriesList: [],
      selectedCategoriesList: [],
    };
  },
  watch: {
    "challengeTemplatesStore.categoriesList": {
      handler() {
        this.getCategories();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
  },
  methods: {
    goBack() {
      this.challengeTemplatesStore.openedTab = "categories";
    },
    // addCategoryToList(arg){
    //   this.categoriesList.push(arg);
    // },
    // deleteCategoryFromList(arg){
    //   this.categoriesList = this.categoriesList.filter((el) => {
    //     if (arg?.length && arg.length > 0){
    //       let foundElementInArray = false;
    //       for (let i = 0; i < arg.length; ++i){
    //         if (arg[i].id === el.id){
    //           foundElementInArray = true;
    //           break;
    //         }
    //       }
    //       return !foundElementInArray;
    //     } else if (arg?.id) {
    //       return el.id !== arg.id;
    //     } else {
    //       return true;
    //     }
    //   });
    // },
    getCategories() {
      this.allCategoriesTree = this.challengeTemplatesStore.categoriesList;
      // this.categoriesList = this.makeCategoriesList();
      // for (let i = 0; i < this.selectedCategoriesList.length; ++i){
      //   this.deleteCategoryFromList(this.selectedCategoriesList[i]);
      // }
    },
    // makeCategoriesList(tree = this.allCategoriesTree){
    //   let result = [];
    //   for (let item of tree) {
    //     result.push({ id: item.id, name: item.name });
    //     if (item.children && item.children.length > 0) {
    //       result = result.concat(this.makeCategoriesList(item.children));
    //     }
    //   }
    //   return result;
    // },
    async addCategory() {
      try {
        if (this.newCategoryName.trim() === "") {
          throw new Error(
            this.$t("challenges.challenge_templates.enter_category_name_error")
          );
        }
        await axios.post(API_URIS.createChallengeTemplateSection, {
          name: this.newCategoryName,
          scope:
            this.challengeTemplatesStore.selectedCategoryNavigationTab.scope,
          upper_sections: this.challengeTemplatesStore
            .selectedSectionForAddition
            ? [this.challengeTemplatesStore.selectedSectionForAddition]
            : [],
        });
        notify(
          this.$t(
            "challenges.challenge_templates.category_successfully_created"
          ),
          "success"
        );
        await this.challengeTemplatesStore.getCategoriesList();
        this.getCategories();
        this.challengeTemplatesStore.openedTab = "categories";
        this.selectedCategoriesList = [];
        this.newCategoryName = "";
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.category_addition {
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
.input_field_wrapper {
  position: relative;
  width: 100%;
}
.input_field_placeholder {
  z-index: 3;
  position: absolute;
  padding: 0px 5px;
  top: -9px;
  left: 15px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.header_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
.new_category_name {
  width: 100%;
  box-sizing: border-box;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>