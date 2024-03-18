import { defineStore } from "pinia";
import { API_URIS } from "@/constants/api";

import i18n from "@/i18n";

import axios from "axios";

export const useStore = defineStore("challengeTemplates", {
  state: () => ({
    categoriesList: [],
    selectedCategoriesList: [],
    selectedCategoryForDelete: null,
    categoriesNavigationTabs: [
      {
        name: i18n.global.t("challenges.challenge_templates.my"),
        scope: 0,
      },
      {
        name: i18n.global.t("challenges.challenge_templates.ours"),
        scope: 1,
      },
      {
        name: i18n.global.t("challenges.challenge_templates.common"),
        scope: 2,
      },
    ],
    selectedCategoryNavigationTab: {
      name: i18n.global.t("challenges.challenge_templates.my"),
      scope: 0,
    },

    openedTab: "inputs",
    settings: [
      {
        name: i18n.global.t("challenges.challenge_templates.visible_to_me"),
        fieldName: "visible_to_me",
        isActive: true,
        isActiveDefault: true,
        visibility: true,
        scope: 0,
      },
      {
        name: i18n.global.t(
          "challenges.challenge_templates.visible_to_organization"
        ),
        fieldName: "visible_to_org",
        isActive: false,
        isActiveDefault: false,
        visibility: true,
        scope: 1,
      },
      {
        name: i18n.global.t("challenges.challenge_templates.visible_to_all"),
        fieldName: "visible_to_all",
        isActive: false,
        isActiveDefault: false,
        visibility: true,
        scope: 2,
      },
      {
        name: i18n.global.t(
          "challenges.challenge_templates.challenge_with_voting"
        ),
        fieldName: "challenge_with_voting",
        isActive: false,
        isActiveDefault: false,
      },
      {
        name: i18n.global.t("challenges.challenge_templates.multiple_reports"),
        fieldName: "multiple_reports",
        isActive: true,
        isActiveDefault: true,
      },
      {
        name: i18n.global.t("challenges.challenge_templates.show_contenders"),
        fieldName: "show_contenders",
        isActive: false,
        isActiveDefault: false,
      },
    ],

    challengeTemplatePhotos: [],
    challengeTemplatePhotosLink: [],

    formData: {
      templateType: null,
      name: null,
      description: null,
    },

    offset: 0,
    limit: 20,
    selectedTemplate: null,
    createChallengeTemplateEnabled: false,
    stopFetching: false,
    isLoading: false,
    selectedSections: [],
    selectedSectionForAddition: null,
    challengeTemplatesList: [],
    challengeTemplatesFilters: [
      // {
      //   name: i18n.global.t("challenges.challenge_templates.all"),
      //   scope:
      // },
      {
        name: i18n.global.t("challenges.challenge_templates.my"),
        scope: 0,
      },
      {
        name: i18n.global.t("challenges.challenge_templates.ours"),
        scope: 1,
      },
      {
        name: i18n.global.t("challenges.challenge_templates.common"),
        scope: 2,
      },
    ],

    selectedFilter: {
      name: i18n.global.t("challenges.challenge_templates.my"),
      scope: 0,
    },
  }),
  actions: {
    resetFormData() {
      this.formData = {
        templateType: null,
        name: null,
        description: null,
      }
    },
    resetState(filter, clearSections = true) {
      if (clearSections) this.selectedSections = [];
      this.challengeTemplatesList = [];
      this.selectedFilter = filter;
      this.offset = 0;
      this.limit = 20;
      this.stopFetching = false;
      this.challengeTemplatePhotos = []
      this.challengeTemplatePhotosLink = []
    },
    selectFilter(filter) {
      this.resetState(filter);
      this.fetchOlderTemplates();
      for (let i = 0; i < this.categoriesNavigationTabs.length; ++i) {
        if (this.categoriesNavigationTabs[i].scope === this.selectedFilter.scope) {
          this.selectedCategoryNavigationTab = this.categoriesNavigationTabs[i];
          break;
        }
      }
      for (let i = 0; i < this.settings.length; ++i) {
        if (this.settings[i].visibility) {
          this.settings[i].isActive = false;
          this.settings[i].isActiveDefault = false;
        }
      }
      for (let i = 0; i < this.settings.length; ++i) {
        if (this.settings[i].scope === this.selectedFilter.scope) {
          this.settings[i].isActive = true;
          this.settings[i].isActiveDefault = true;
        }
      }
    },
    addSection(category) {
      this.selectedSections.push(category);
      this.resetState(this.selectedFilter, false);
      this.fetchOlderTemplates();
    },
    deleteSection(category) {
      this.selectedSections = this.selectedSections.filter(
        (item) => item.id !== category.id
      );
      this.resetState(this.selectedFilter, false);
      this.fetchOlderTemplates();
    },
    async getCategoriesList() {
      try {
        const response = await axios.get(API_URIS.getSections, {
          params: {
            scope: this.selectedCategoryNavigationTab.scope
          }
        });
        this.categoriesList = response.data.data;
      } catch (err) {
        throw err;
      }
    },
    async fetchOlderTemplates() {
      try {
        this.isLoading = true;
        this.offset += 1;
        let sections = this.selectedSections.map((item) => item.id);
        let params = {
          offset: this.offset,
          limit: this.limit,
          scope: this.selectedFilter.scope,
          section: sections,
        };
        const paramString = Object.entries(params)
          .map(([key, values]) =>
            (Array.isArray(values) ? values : [values])
              .map((value) => `${key}=${value}`)
              .join("&")
          )
          .join("&");
        const response = await axios.get(
          API_URIS.getChallengesTemplates + `?${paramString}`
        );
        this.challengeTemplatesList.push(...response.data);
        this.isLoading = false;
        if (response.data.length < this.limit) {
          this.stopFetching = true;
        }
        if (response.data.length == 0) {
          this.offset -= 1;
        }
      } catch (err) {
        this.isLoading = false;
        throw err;
      }
    },

    refreshImages() {
      setTimeout(() => {
        this.challengeTemplatePhotosLink = this.challengeTemplatePhotosLink.filter(el => el !== undefined)

        if (this.challengeTemplatePhotosLink.length > 1 && this.challengeTemplatePhotos.length > 1) {
          let sortedChallengeTemplatePhotos = this.challengeTemplatePhotosLink.map(item => {
            const { name } = item
            return this.challengeTemplatePhotos.find(item => item.name === name)
          })
          this.challengeTemplatePhotos = sortedChallengeTemplatePhotos
        }
      }, 150);
    },
    removeImageFromList(index) {
      this.challengeTemplatePhotos.splice(index, 1);
      this.challengeTemplatePhotosLink.splice(index, 1);
    },
  },
});
