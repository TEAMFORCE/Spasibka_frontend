import { defineStore } from "pinia";
import { API_URIS } from "@/constants/api";

import i18n from "@/i18n";

import axios from "axios";

export const useStore = defineStore("challenges", {
  state: () => ({
    offset: 0,
    limit: 20,
    createChallengeEnabled: false,
    createChallengeChainEnabled: false,
    challengeChainsOpened: false,
    stopFetching: false,
    isLoading: false,
    challengesList: [],
    challengesFilters: [
      {
        name: i18n.global.t("challenges.active"),
        param: "challenge_condition",
        paramValue: "A"
      },
      {
        name: i18n.global.t("challenges.upcoming"),
        param: "challenge_condition",
        paramValue: "D"
      },
      {
        name: i18n.global.t("challenges.ended"),
        param: "challenge_condition",
        paramValue: "C"
      },
    ],

    selectedFilter: {
      name: i18n.global.t("challenges.active"),
      param: "challenge_condition",
      paramValue: "A"
    }
  }),
  actions: {
    selectFilter(filter) {
      this.challengesList = [];
      this.selectedFilter = filter;
      this.offset = 0;
      this.limit = 20;
      this.stopFetching = false;
      this.fetchOlderChallenges();
    },
    async fetchOlderChallenges() {
      try {
        this.isLoading = true;
        this.offset += 1;
        let params = {
          offset: this.offset,
          limit: this.limit
        };
        if (this.selectedFilter.param) {
          params[this.selectedFilter.param] = this.selectedFilter.paramValue;
        }
        const response = await axios.get(API_URIS.challengesUpdate, { params: params });
        this.challengesList.push(...response.data.data);
        this.isLoading = false;
        if (response.data.data.length < this.limit) {
          this.stopFetching = true;
        }
      } catch (err) {
        this.isLoading = false;
        throw err;
      }
    },
  },
});
