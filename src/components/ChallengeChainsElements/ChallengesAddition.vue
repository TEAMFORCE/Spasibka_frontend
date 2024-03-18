<template>
  <div class="challenges_addition_wrapper">
    <div class="challenges_addition general-white-bg">
      <div class="headers_and_challenges">
        <div class="challenges_addition_headers">
          <h1 class="challenges_addition_main_header general-contrast-color">
            {{ $t("challenges.challenge_chains.challenge_chain") }}
          </h1>
          <h1
            class="challenges_addition_additional_header general-secondary-color"
          >
            {{ $t("challenges.challenge_chains.select_challenges_for_chain") }}
          </h1>
        </div>
      </div>
      <div class="challenges_list">
        <div class="challenge_item" v-for="item in challengesList">
          <input v-model="item.selected" type="checkbox" class="checkbox" />
          {{ item.name }}
        </div>
      </div>
      <div class="action_buttons general-white-bg">
        <button
          @click="saveChosenChallenges"
          class="action_button general-brand-bg general-white-color"
        >
          {{
            $t("challenges.challenge_chains.select") +
            selectedChallengesCountString
          }}
        </button>
        <button
          @click="cancelChosenChallenges"
          class="action_button brand-secondary-bg general-brand-color"
        >
          {{ $t("challenges.challenge_chains.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";

import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";

export default {
  name: "ChallengesAddition",
  props: {
    selectedChallengesList: {
      required: true,
      default: [],
    },
    isChain: {
      default: false,
    },
    currentChainID: {
      default: null,
    },
    isUpdating: {
      default: false,
    },
  },
  data() {
    return {
      challengesList: [],
    };
  },

  computed: {
    ...mapStores(useChallengeTemplatesStore),

    selectedChallengesCountString() {
      let selectedChallengesCount = 0;
      for (let i = 0; i < this.challengesList.length; ++i) {
        if (this.challengesList[i].selected) {
          selectedChallengesCount++;
        }
      }
      if (selectedChallengesCount > 0) {
        return " (" + selectedChallengesCount + ")";
      } else {
        return "";
      }
    },
  },
  methods: {
    saveChosenChallenges() {
      this.challengesList = this.challengesList.filter((el) => el.selected);

      this.$emit("saveChosenChallenges", this.challengesList);
    },
    cancelChosenChallenges() {
      this.$emit("cancelChosenChallenges");
    },
    markSelectedChallenges() {
      for (let i = 0; i < this.selectedChallengesList.length; ++i) {
        for (let j = 0; j < this.challengesList.length; ++j) {
          if (this.selectedChallengesList[i].id === this.challengesList[j].id) {
            this.challengesList[j].selected =
              this.selectedChallengesList[i].selected;
          }
        }
      }
    },
    async getChainChallenges() {
      try {
        let params = {
          group_id: this.currentChainID,
          offset: 1,
          limit: 10000,
        };
        const response = await axios.get(API_URIS.challengesUpdate, {
          params,
        });
        this.challengesList.unshift(...response.data.data);
        this.markSelectedChallenges();
      } catch (err) {
        throw err;
      }
    },
    async getChallengesList() {
      try {
        let params = {
          group_id: 0,
          offset: 1,
          limit: 10000,
        };
        const response = await axios.get(API_URIS.challengesUpdate, {
          params,
        });
        this.challengesList = response.data.data;
        if (this.currentChainID) {
          this.getChainChallenges();
        } else {
          this.markSelectedChallenges();
        }
      } catch (err) {
        throw err;
      }
    },
    markSelectedTemplates(data) {
      for (let i = 0; i < this.challengesList.length; i++) {
        if (data[i]?.id) {
          this.challengesList.find((el) => el.id == data[i].id).selected = true;
        }
      }
    },
    async getChallengeChainPinnedTemplates() {
      try {
        let params = {
          offset: 1,
          limit: 10000,
          scope:
            this.challengeTemplatesStore.selectedCategoryNavigationTab.scope,
          chain: this.currentChainID,
        };
        const response = await axios.get(API_URIS.getChallengesTemplates, {
          params,
        });
        this.challengesList.unshift(...response.data);
        this.markSelectedTemplates(response.data);
      } catch (err) {
        throw err;
      }
    },
    async getChallengeTemplates() {
      try {
        let params = {
          offset: 1,
          limit: 10000,
          scope:
            this.challengeTemplatesStore.selectedCategoryNavigationTab.scope,
          clean_templates: true,
        };
        const response = await axios.get(API_URIS.getChallengesTemplates, {
          params,
        });
        this.challengesList = response.data;
        if (this.currentChainID && this.isUpdating) {
          this.getChallengeChainPinnedTemplates();
        } else {
          this.markSelectedChallenges(response.data);
        }
      } catch (err) {
        throw err;
      }
    },
  },
  mounted() {
    if (this.isChain) {
      this.getChallengeTemplates();
    } else {
      this.getChallengesList();
    }
    if (this.isUpdating && this.isChain) {
      this.$emit("oldSelectedChallengesList", this.selectedChallengesList);
    }
  },
};
</script>

<style scoped>
.challenges_addition_wrapper {
  position: fixed;
  z-index: 10000;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: auto;
  display: flex;
}
.challenges_addition {
  width: 100%;
  max-width: 541px;
  height: 70vh;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
  gap: 16px;
  margin: auto;
}
.headers_and_challenges {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.challenges_addition_headers {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
.challenges_addition_main_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.challenges_addition_additional_header {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
}
.challenges_list {
  max-height: 80%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  gap: 8px;
}
.challenge_item {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 13px 13px 13px 0px;
  border-bottom: 1px solid var(--generalColorGrey);
  margin-right: 10px;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0px;
  text-align: left;
}
.action_buttons {
  box-shadow: 0px -9px 24px 0px rgba(138, 138, 138, 0.1);
  width: 100%;
  margin: 0px -32px -32px -32px;
  padding: 32px;
  display: flex;
  gap: 12px;
  border-radius: 0px 0px 24px 24px;
}
.action_button {
  width: 50%;
  border-radius: 6px;
  padding: 16px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
</style>