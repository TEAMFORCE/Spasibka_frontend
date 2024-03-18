<template>
  <div class="challenge_update_card general-white-bg">
    <div class="challenge_update_card_title_wrapper">
      <h3 class="challenge_update_card_title">
        {{ $t("challenges.challenge_chains.challenge_chain") }}
      </h3>
      <h5 class="challenge_update_card_description">
        {{ $t("challenges.challenge_chains.choose_chains") }}
      </h5>
    </div>
    <div
      class="chains_list"
      v-if="createChallengeStore?.groups?.length"
      v-scroll-end="handleScrollEnd"
      ref="scrollContainer"
    >
     <Loading
        class="spinner_loader"
        :active="isLoading"
        :isFullPage="false"
        ref="spinnerLoader"
      />
      <div 
        class="chain_selection"
        v-for="(item, index) in createChallengeStore?.groups"
      >
        <div 
          class="checkbox_and_chain_name general-contrast-color"
          @click="selectChain(index)"
        >
          <SelectedChainIcon
            class="chain_select_checkbox"
            v-if="item.selected"
          />
          <UnselectedChainIcon
            class="chain_select_checkbox"
            v-else
          />
          {{ item.name }}
        </div>
        <hr
          class="separator"
          v-if="index < createChallengeStore?.groups?.length - 1"
        />
      </div>
    </div>
    <div class="challenge_update_card_buttons">
      <button class="challenge_button _save" @click="selectChains">
        {{ $t("challenges.challenge_chains.back") }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";

import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";
import { useStore as useProfileStore } from "@/store/profile";

import { CHALLENGE_CONDITIONS } from "@/infrastructure/constants/challenge-conditions";
import Datepicker from "@vuepic/vue-datepicker";
import vSelect from "vue-select";

import SelectedChainIcon from "@/components/Icons/ChallengesIcons/SelectedChainIcon.vue";
import UnselectedChainIcon from "@/components/Icons/ChallengesIcons/UnselectedChainIcon.vue";

import Loading from "vue3-loading-overlay";

export default {
  name: "CreateChallengeAssignChains",
  components: {
    Datepicker,
    vSelect,
    SelectedChainIcon,
    UnselectedChainIcon,
    Loading
  },
  directives: {
    scrollEnd: {
      mounted(el, binding) {
        const handler = () => {
          let tolerance = 1;
          if (el.scrollTop + el.clientHeight + tolerance >= el.scrollHeight) {
            binding.value();
          }
        };
        el.addEventListener("scroll", handler);
        el._handleScroll = handler; // Store the handler on the element
      },
      beforeUnmount(el) {
        el.removeEventListener("scroll", el._handleScroll);
      },
    },
  },
  data() {
    return {
      offset: 1,
      limit: 20,
      isLoading: false,
      stopFetching: false,
    };
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
    ...mapStores(useProfileStore),
  },
  watch: {
    isLoading: {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      }
    },
    "profileStore.profileInfo": {
      handler(newVal) {
        if (newVal) {
          this.getChainsList();
        }
      },
      immediate: true
    }
  },
  methods: {
    selectChain(index) {
      if (this.createChallengeStore.groups[index].selected) {
        this.createChallengeStore.groups[index].selected = false;
        return;
      }

      let alreadySelected = false;
      let alreadySelectedIndex = -1;
      for (let i = 0; i < this.createChallengeStore.groups?.length; ++i) {
        if (i === index) continue;
        let curChain = this.createChallengeStore.groups[i];
        if (curChain.selected) {
          alreadySelected = true;
          alreadySelectedIndex = i;
          break;
        }
      }
      if (alreadySelected) {
        this.createChallengeStore.groups[alreadySelectedIndex].selected = false;
      }
      this.createChallengeStore.groups[index].selected = true;
    },
    positionLoader() {
      const el = this.$refs.scrollContainer;
      if (el) {
        const rect = el.getBoundingClientRect();
        const loaderEl = this.$refs.spinnerLoader.$el;
        loaderEl.style.position = "fixed";
        loaderEl.style.top = `${rect.top}px`;
        loaderEl.style.left = `${rect.left}px`;
        loaderEl.style.width = `${rect.width}px`;
        loaderEl.style.height = `${rect.height}px`;
      }
    },
    handleScrollEnd() {
      if (!this.isLoading && !this.stopFetching) {
        this.offset++;
        this.getChainsList();
      }
    },
    selectChains() {
      if (this.createChallengeStore.simplifiedCreation) {
        this.createChallengeStore.selectedTab = "settings";
      } else {
        this.createChallengeStore.selectedTab = "mainInputs";
      }
    },
    async getChainsList() {
      try {
        this.isLoading = true;
        let params = {
          offset: this.offset,
          limit: this.limit,
        };
        const response = await axios.get(API_URIS.challengeGroups.replace("organization_id", this.profileStore.profileInfo.profile.organization_id), {
          params
        });
        this.createChallengeStore.groups.push(...response.data.data);
        if (response.data.data.length < this.limit) {
          this.stopFetching = true;
        }
        this.isLoading = false;
      } catch(err) {
        this.isLoading = false;
        throw err;
      }
    }
  },
};
</script>

<style scoped>
.challenge_update_card {
  width: 100%;
  height: 70vh;
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
.challenge_update_card_title_wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.challenge_update_card_title {
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  font-family: "Ubuntu";
  color: var(--generalContrast);
  margin: 0;
}
.challenge_update_card_description {
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  font-family: "SF Pro Text";
  color: var(--generalColorSecondary);
  margin: 0;
}
.chains_list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  gap: 8px;
}
.chain_selection {
  display: flex;
  flex-direction: column;
}
.checkbox_and_chain_name {
  padding: 13px 13px 13px 0px;
  display: flex;
  align-items: center;
  gap: 32px;
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
}
.chain_select_checkbox {
  height: 20px;
  width: 20px;
}
.separator {
  width: 100%;
}
.challenge_update_card_buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}
.challenge_button {
  width: 100%;
  height: 48px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 400;
}
._save {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
._cancel {
  background-color: var(--secondaryColorBrand);
  color: var(--generalBrand);
}
.vs__selected {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.vs__selected-options {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vs__dropdown-option {
  white-space: normal;
  word-wrap: break-word;
}
</style>