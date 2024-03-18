<template>
  <div class="create_challenge_template general-white-bg">
    <ChallengesAddition
      v-if="challengesAdditionOpened"
      @saveChosenChallenges="saveChosenChallenges"
      @cancelChosenChallenges="cancelChosenChallenges"
      @oldSelectedChallengesList="oldSelectedChallengesListSet"
      :selectedChallengesList="selectedChallengesList"
      :isChain="isChain"
      :isUpdating="isUpdating"
      :currentChainID="currentChainTemplateId"
    />
    <ChallengesDistribution
      v-if="challengesDistributionOpened"
      :chainSteps="chainSteps"
      @saveConfiguredChallenges="saveConfiguredChallenges"
      @cancelConfiguredChallenges="closeChallengesDistribution"
    />
    <div class="header_info">
      <div class="window_info">
        <h1 v-if="isUpdating" class="new_template_text general-contrast-color">
          {{ $t("challenges.challenge_templates.update_template") }}
        </h1>
        <h1 v-else class="new_template_text general-contrast-color">
          {{ $t("challenges.challenge_templates.new_template") }}
        </h1>
        <h1 class="fill_template_text general-secondary-color">
          {{ $t("challenges.challenge_templates.fill_template_info") }}
        </h1>
      </div>
      <button
        class="settings_text general-brand-color transparent-bg"
        @click="goToTemplateSettings"
      >
        {{ $t("challenges.challenge_templates.settings") }}
      </button>
    </div>
    <div class="input_fields_wrapper">
      <div class="input_field">
        <div class="input_field_wrapper">
          <div
            v-if="formData.templateType"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("challenges.challenge_templates.template_type") }}
          </div>
          <vSelect
            v-model="formData.templateType"
            :options="templateTypes"
            :placeholder="$t('challenges.challenge_templates.template_type')"
            label="title"
          />
        </div>
      </div>
      <div class="input_field" v-for="inputField in inputFields">
        <div class="input_field_wrapper">
          <div
            v-if="formData[inputField.fieldName]"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ inputField.placeholder }}
          </div>
          <component
            class="input_field_component"
            :is="inputField.type"
            :placeholder="inputField.placeholder"
            :value="formData[inputField.fieldName]"
            :maxlength="getMaxLength(inputField.fieldName)"
            @input="updateFormData(inputField, $event)"
          />
        </div>
      </div>
    </div>
    <button
      v-if="isChain"
      class="add_challenges brand-secondary-bg general-brand-color"
      @click="openChallengesAddition"
    >
      {{
        $t("challenges.challenge_chains.add_challenges") +
        selectedChallengesCountString
      }}
    </button>
    <button
      v-if="isAnyChallengeSelected"
      @click="openChallengesDistribution"
      class="add_challenges general-brand-bg general-white-color"
    >
      {{ $t("challenges.challenge_chains.configure_steps") }}
    </button>
    <CategorySelection
      :categoriesTree="allCategoriesTree"
      :autofilledCategories="autofilledCategories"
    />
    <ChallengeTemplateCoverLoader
      v-if="!isUpdating"
      ref="challengeTemplateCovers"
      @blockScroll="blockScroll"
      @unlockScroll="unlockScroll"
      @imageCropped="createChallengeTemplate"
    />
    <ChallengeCoverLoader
      v-else
      ref="coverLoader"
      :buttonText="$t('challenges.challenge_templates.template_cover')"
      :photos="challengeTemplatesStore.selectedTemplate?.photos"
      @fileListSort="fileListSortChanged"
      @fileListForSend="fileListForSendChanged"
      @coverImageChanged="coverImageChanged"
      @imageCropped="createChallengeTemplate"
    />
    <button
      class="manage_settings transparent-bg general-brand-color"
      @click="goToCategorySettings"
    >
      {{ $t("challenges.challenge_templates.manage_categories") }}
    </button>
    <div class="action_buttons">
      <!-- @click="checkPhotos" -->
      <button
        @click="handleIsUpdating"
        class="action_button general-brand-bg general-white-color"
      >
        {{ $t("challenges.challenge_templates.save_template") }}
      </button>
      <button
        class="action_button brand-secondary-bg general-brand-color"
        @click="closeChallengeTemplateCreation"
      >
        {{ $t("challenges.challenge_templates.cancel_saving_template") }}
      </button>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";

import SelectChallengeCoverIcon from "@/components/Icons/ChallengesIcons/SelectChallengeCoverIcon.vue";
import CancelSelectedImageIcon from "@/components/Icons/ChallengesIcons/CancelSelectedImageIcon.vue";
import CategorySelection from "./CategorySelection.vue";
import ChallengesAddition from "@/components/ChallengeChainsElements/ChallengesAddition.vue";
import ChallengesDistribution from "@/components/ChallengeChainsElements/ChallengesDistribution.vue";
import ChallengeTemplateCoverLoader from "./ChallengeTemplateCoverLoader.vue";
import ChallengeCoverLoader from "@/components/ChallengeItemElements/ChallengeCoverLoader.vue";

import { TEMPLATE_TYPES } from "@/infrastructure/data-sources/template-types";
import { TEMPLATE_TYPE } from "@/infrastructure/constants/template-type";
import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "CreateChallengeTemplateInputs",
  components: {
    SelectChallengeCoverIcon,
    CancelSelectedImageIcon,
    CategorySelection,
    vSelect,
    Treeselect,
    ChallengesAddition,
    ChallengesDistribution,
    ChallengeTemplateCoverLoader,
    ChallengeCoverLoader,
  },
  data() {
    return {
      autofilledCategories: [],
      allCategoriesTree: [],
      categoriesList: [],
      selectedCategoriesList: [],

      selectedChallengesList: [],
      oldSelectedChallengesList: [],
      chainSteps: [],

      formData: {
        templateType: null,
        name: null,
        description: null,
      },

      // For Update
      fileList: null,
      photos: null,
      coverChanged: false,
      // For Update

      inputFields: [
        {
          type: "input",
          fieldName: "name",
          placeholder: this.$t(
            "challenges.challenge_templates.new_template_name"
          ),
        },
        {
          type: "textarea",
          fieldName: "description",
          placeholder: this.$t(
            "challenges.challenge_templates.new_template_description"
          ),
        },
      ],

      challengesAdditionOpened: false,
      challengesDistributionOpened: false,
    };
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
    templateTypes() {
      return TEMPLATE_TYPES(this);
    },
    selectedChallengesCountString() {
      let selectedChallengesCount = 0;
      for (let i = 0; i < this.selectedChallengesList.length; ++i) {
        if (this.selectedChallengesList[i].selected) {
          selectedChallengesCount++;
        }
      }
      if (selectedChallengesCount > 0) {
        return " (" + selectedChallengesCount + ")";
      } else {
        return "";
      }
    },
    isAnyChallengeSelected() {
      for (let i = 0; i < this.selectedChallengesList.length; ++i) {
        if (this.selectedChallengesList[i].selected) return true;
      }
      return false;
    },
    isChain() {
      if (this.formData.templateType?.type == TEMPLATE_TYPE.chain) {
        return true;
      } else {
        return false;
      }
    },
    isUpdating() {
      if (this.challengeTemplatesStore.selectedTemplate) {
        return true;
      } else {
        return false;
      }
    },
    currentChainTemplateId() {
      if (this.challengeTemplatesStore.selectedTemplate?.id) {
        return this.challengeTemplatesStore.selectedTemplate.id;
      } else {
        return null;
      }
    },
  },
  watch: {
    "formData.templateType": {
      handler() {
        if (!this.isUpdating) {
          this.challengeTemplatesStore.formData.templateType =
            this.formData.templateType;
        }
      },
    },
    "formData.name": {
      handler() {
        if (!this.isUpdating) {
          this.challengeTemplatesStore.formData.name = this.formData.name;
        }
      },
    },
    "formData.description": {
      handler() {
        if (!this.isUpdating) {
          this.challengeTemplatesStore.formData.description =
            this.formData.description;
        }
      },
    },
    "challengeTemplatesStore.categoriesList": {
      handler() {
        this.getCategories();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    oldSelectedChallengesListSet(value) {
      this.oldSelectedChallengesList = value;
    },
    setFormData() {
      if (!this.isUpdating) {
        this.formData = this.challengeTemplatesStore.formData;
      }
    },
    blockScroll() {
      document.body.style.overflow = "hidden";
      let wrapper = document.getElementsByClassName(
        "create_challenge_template_wrapper"
      );
      wrapper[0].style.overflow = "hidden";
    },
    unlockScroll() {
      document.body.style.overflow = "";
      let wrapper = document.getElementsByClassName(
        "create_challenge_template_wrapper"
      );
      wrapper[0].style.overflow = "";
    },
    openChallengesAddition() {
      this.challengesAdditionOpened = true;
    },
    cancelChosenChallenges() {
      this.challengesAdditionOpened = false;
    },
    saveChosenChallenges(newChallengesList) {
      this.selectedChallengesList = newChallengesList;
      this.challengesAdditionOpened = false;
      this.initializeSteps();
    },
    findSelectedByStep(items, step) {
      let challengeList = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].selected && items[i].step === step && this.isUpdating) {
          challengeList.push(items[i]);
        } else if (
          items[i].selected &&
          items[i].step !== step &&
          !this.isUpdating
        ) {
          challengeList.push(items[i]);
        }
      }
      if (challengeList.length) {
        return challengeList;
      } else {
        return 0;
      }
    },
    initializeSteps() {
      let stepCount = 1;
      for (let i = 0; i < this.selectedChallengesList.length; i++) {
        stepCount = Math.max(this.selectedChallengesList[i].step, stepCount);
      }
      let newChainSteps = [];

      for (let i = 0; i < stepCount; i++) {
        newChainSteps.push({
          title: this.$t("challenges.challenge_chains.step") + ` ${i + 1}`,
          items: this.findSelectedByStep(this.selectedChallengesList, i + 1),
        });
      }
      setTimeout(() => {
        if (
          this.selectedChallengesList.find((el) => el.step == 0) &&
          this.isUpdating
        ) {
          let newAddedSteps = this.selectedChallengesList.filter(
            (el) => el.step == 0
          );

          for (let i = 0; i < newAddedSteps.length; i++) {
            newChainSteps[0].items.push(newAddedSteps[i]);
          }
        }
        this.chainSteps = newChainSteps.filter((el) => el.items !== 0);
      }, 100);
    },
    saveConfiguredChallenges(newChainSteps) {
      this.chainSteps = newChainSteps;
      this.challengesDistributionOpened = false;
    },
    openChallengesDistribution() {
      this.challengesDistributionOpened = true;
    },
    closeChallengesDistribution() {
      this.challengesDistributionOpened = false;
    },
    getMaxLength(type) {
      switch (type) {
        case "name":
          return 255;
        // ... other cases
        default:
          return 10000; // or a default value
      }
    },
    addCategoryToList(arg) {
      this.categoriesList.push(arg);
    },
    deleteCategoryFromList(arg) {
      this.categoriesList = this.categoriesList.filter((el) => {
        if (arg?.length && arg.length > 0) {
          let foundElementInArray = false;
          for (let i = 0; i < arg.length; ++i) {
            if (arg[i].id === el.id) {
              foundElementInArray = true;
              break;
            }
          }
          return !foundElementInArray;
        } else if (arg?.id) {
          return el.id !== arg.id;
        } else {
          return true;
        }
      });
    },
    addLabelAttributeAndRemoveEmptyChildren(tree) {
      if (!tree || !Array.isArray(tree)) return;
      for (let node of tree) {
        if (node.name) {
          node.label = node.name;
        }
        if (node.children && Array.isArray(node.children)) {
          if (node.children.length === 0) {
            delete node.children;
          } else {
            this.addLabelAttributeAndRemoveEmptyChildren(node.children);
          }
        }
      }
    },
    getCategories() {
      this.allCategoriesTree = this.challengeTemplatesStore.categoriesList;
      this.addLabelAttributeAndRemoveEmptyChildren(this.allCategoriesTree);
      if (this.challengeTemplatesStore.selectedTemplate) {
        let sections = this.challengeTemplatesStore.selectedTemplate.sections;
        // this.selectedCategoriesList = sections;
        // for (let i = 0; i < sections.length; ++i) {
        //   this.deleteCategoryFromList(sections[i]);
        // }
        this.selectedCategoriesList = sections.map((item) => item.id);
      }
      // this.categoriesList = this.makeCategoriesList();
      // for (let i = 0; i < this.selectedCategoriesList.length; ++i) {
      //   this.deleteCategoryFromList(this.selectedCategoriesList[i]);
      // }
    },
    makeCategoriesList(tree = this.allCategoriesTree) {
      let result = [];
      for (let item of tree) {
        if (item.is_on) result.push(item.id);
        if (item.children && item.children.length > 0) {
          result = result.concat(this.makeCategoriesList(item.children));
        }
      }
      return result;
    },
    setType(type) {
      if (type === TEMPLATE_TYPE.challenge) {
        return this.templateTypes.find(
          (el) => el.type == TEMPLATE_TYPE.challenge
        );
      } else if (type == TEMPLATE_TYPE.chain) {
        return this.templateTypes.find((el) => el.type == TEMPLATE_TYPE.chain);
      }
    },
    autoFillInputs() {
      if (this.challengeTemplatesStore.selectedTemplate) {
        this.formData.templateType = this.setType(
          this.challengeTemplatesStore.selectedTemplate.type
        );
        this.challengeTemplatesStore.selectedTemplate.type;
        this.autofilledCategories =
          this.challengeTemplatesStore.selectedTemplate.sections;
        this.formData.name = this.challengeTemplatesStore.selectedTemplate.name;
        this.formData.description =
          this.challengeTemplatesStore.selectedTemplate.description;
      }
    },
    closeChallengeTemplateCreation() {
      if (this.isUpdating) {
        this.challengeTemplatesStore.createChallengeTemplateEnabled = false;
        this.challengeTemplatesStore.selectedTemplate = false;
        // this.challengeTemplatesStore.selectFilter(
        //   this.challengeTemplatesStore.selectedFilter
        // );
      } else {
        this.challengeTemplatesStore.createChallengeTemplateEnabled = false;
      }
    },
    goToTemplateSettings() {
      this.challengeTemplatesStore.openedTab = "settings";
    },
    goToCategorySettings() {
      this.challengeTemplatesStore.openedTab = "categories";
    },
    updateFormData(inputField, $event) {
      this.formData[inputField.fieldName] = $event.target.value;
    },
    fileListSortChanged(list) {
      this.fileList = list;
    },
    fileListForSendChanged(list) {
      this.photos = list;
    },
    coverImageChanged() {
      this.coverChanged = true;
    },
    checkCover() {
      if (this.coverChanged && this.fileList.length) {
        this.$refs.coverLoader.openCropper();
      } else {
        this.createChallengeTemplate();
      }
    },
    checkPhotos() {
      let currentPhotos = this.challengeTemplatesStore.challengeTemplatePhotos;
      if (currentPhotos.length) {
        this.$refs.challengeTemplateCovers.openCropper();
      } else {
        this.createChallengeTemplate();
      }
    },
    handleIsUpdating() {
      if (this.isUpdating) {
        this.checkCover();
      } else {
        this.checkPhotos();
      }
    },
    searchDeleted(steps) {
      let result = this.oldSelectedChallengesList.filter(
        (obj1) => !steps.some((obj2) => obj2.id === obj1.id)
      );
      let newResult = [];
      for (let i = 0; i < result.length; i++) {
        newResult.push({
          id: result[i].id,
          step: 0,
          step_sort: i + 1,
        });
      }
      return newResult;
    },
    async createChallengeTemplate(file) {
      try {
        let dataToSend = new FormData();
        dataToSend.append("type", this.formData.templateType.type);
        if (file) {
          dataToSend.append("cropped_photo", file);
        }
        if (!this.isUpdating) {
          for (
            let i = 0;
            i < this.challengeTemplatesStore.challengeTemplatePhotos.length;
            i++
          ) {
            dataToSend.append(
              "photos",
              this.challengeTemplatesStore.challengeTemplatePhotos[i]
            );
          }
        }
        if (this.isUpdating) {
          dataToSend.append("fileList", JSON.stringify(this.fileList));
          for (let i = 0; i < this.photos.length; i++) {
            dataToSend.append("photos", this.photos[i]);
          }
        }
        if (this.formData.name) {
          dataToSend.append("name", this.formData.name);
        }
        if (this.formData.description) {
          dataToSend.append("description", this.formData.description);
        }

        if (this.formData.templateType?.type == TEMPLATE_TYPE.chain) {
          let stepsToSend = [];
          for (let i = 0; i < this.chainSteps.length; ++i) {
            for (let j = 0; j < this.chainSteps[i].items.length; ++j) {
              stepsToSend.push({
                id: this.chainSteps[i].items[j].id,
                step: i + 1,
                step_sort: j + 1,
              });
            }
          }

          stepsToSend.push(...this.searchDeleted(stepsToSend));
          if (stepsToSend.length) {
            dataToSend.append("steps", JSON.stringify(stepsToSend));
          }
        }

        let settings = this.challengeTemplatesStore.settings;
        for (let i = 0; i < settings.length; ++i) {
          if (settings[i].visibility && settings[i].isActive) {
            if (settings[i].fieldName == "visible_to_me") {
              dataToSend.append("scope", 0);
            }
            if (settings[i].fieldName == "visible_to_org") {
              dataToSend.append("scope", 1);
            }
            if (settings[i].fieldName == "visible_to_all") {
              dataToSend.append("scope", 2);
            }
          }
          if (settings[i].fieldName == "challenge_with_voting") {
            if (settings[i].isActive) {
              dataToSend.append("challenge_type", "voting");
            } else {
              dataToSend.append("challenge_type", "default");
            }
          }
          if (settings[i].fieldName == "multiple_reports") {
            if (settings[i].isActive) {
              dataToSend.append("multiple_reports", "yes");
            } else {
              dataToSend.append("multiple_reports", "no");
            }
          }
          if (settings[i].fieldName == "show_contenders") {
            if (settings[i].isActive) {
              dataToSend.append("show_contenders", "yes");
            } else {
              dataToSend.append("show_contenders", "no");
            }
          }
        }

        let selectedCategoriesList =
          this.challengeTemplatesStore.selectedCategoriesList;
        const jsonSections = JSON.stringify(selectedCategoriesList);
        dataToSend.append("sections", jsonSections);

        if (this.challengeTemplatesStore.selectedTemplate) {
          dataToSend.append(
            "challenge_template",
            this.challengeTemplatesStore.selectedTemplate.id
          );
          await axios.post(API_URIS.updateChallengeTemplate, dataToSend);
          this.challengeTemplatesStore.createChallengeTemplateEnabled = false;
          this.challengeTemplatesStore.selectedTemplate = null;
          this.challengeTemplatesStore.selectFilter(
            this.challengeTemplatesStore.selectedFilter
          );
          notify(
            this.$t(
              "challenges.challenge_templates.template_successfully_updated"
            ),
            "success"
          );
        } else {
          await axios.post(API_URIS.createChallengeTemplate, dataToSend);
          this.challengeTemplatesStore.createChallengeTemplateEnabled = false;
          this.challengeTemplatesStore.selectedTemplate = null;
          this.challengeTemplatesStore.selectFilter(
            this.challengeTemplatesStore.selectedFilter
          );
          notify(
            this.$t(
              "challenges.challenge_templates.template_successfully_created"
            ),
            "success"
          );
          this.challengeTemplatesStore.resetFormData();
        }
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    async getChallengeChainPinnedTemplates() {
      try {
        let params = {
          offset: 1,
          limit: 10000,
          scope:
            this.challengeTemplatesStore.selectedCategoryNavigationTab.scope,
          chain: this.challengeTemplatesStore.selectedTemplate.id,
        };
        const response = await axios.get(API_URIS.getChallengesTemplates, {
          params,
        });
        let selectedData = response.data;
        for (let i = 0; i < response.data.length; i++) {
          selectedData[i].selected = true;
        }
        this.saveChosenChallenges(selectedData);
      } catch (err) {
        throw err;
      }
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.isUpdating && this.isChain) {
        this.getChallengeChainPinnedTemplates();
      }
    }, 100);
    this.autoFillInputs();
    this.setFormData();
  },
};
</script>

<style scoped>
.create_challenge_template {
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

.header_info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.window_info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.new_template_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
.fill_template_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  text-align: left;
}
.settings_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-decoration-line: underline;
}
.input_fields_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}
.input_field {
  width: 100%;
  padding: 0;
  border: none;
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
.add_challenges {
  border-radius: 12px;
  padding: 16px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
.input_field_component {
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--generalColorGrey);
  padding: 16px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  background-color: var(--generalColorWhite);
}
::v-deep(.vue-treeselect__control) {
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
}
.template_photo_select_wrapper {
  padding: 16px;
  border: 1px solid var(--generalBrand);
  border-radius: 12px;
  display: flex;
  gap: 8px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  align-items: center;
  justify-content: center;
}
.template_photo_select_wrapper:hover {
  cursor: pointer;
}
.select_challenge_cover_icon {
  height: 24px;
  width: 24px;
}
.invisible {
  display: none;
}
.selected_photo_wrapper {
  width: 100px;
  height: 100px;
  position: relative;
}
.cancel_selected_image_icon {
  position: absolute;
  top: 5px;
  right: 5px;
  height: 24px;
  width: 24px;
  z-index: 5;
}
.cancel_selected_image_icon:hover {
  cursor: pointer;
}
.selected_photo {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
  filter: brightness(70%);
}
.manage_settings {
  padding: 16px;
  border-style: none;
  text-align: center;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  text-align: center;
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>
