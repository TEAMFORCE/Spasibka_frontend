<template>
  <div
    class="challenge_chains general-white-bg"
    v-scroll-end="handleScrollEnd"
    ref="scrollContainer"
  >
    <Loading
      class="spinner_loader"
      :active="isLoading"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <CreateChallengeChain
      v-if="chainCreationEnabled"
      @chainCreationCancelled="chainCreationCancelled"
      @challengeChainCreated="challengeChainCreated"
    />
    <h1 class="header_text general-contrast-color">
      {{ $t("challenges.challenge_chains.challenge_chains") }}
    </h1>
    <div class="tabs_and_actions">
      <div class="tabs"></div>
      <div class="challenges_actions">
        <div
          class="challenge_action brand-secondary-bg"
          @click="openChainCreation"
          :data-tooltip="
            $t('challenges.challenge_chains.create_challenge_chain')
          "
        >
          <!-- {{ action.name }} -->
          <AddCategoryIcon class="create_challenge_icon" />
        </div>
        <div
          class="challenge_action brand-secondary-bg"
          @click="goToChallengeTemplates"
          :data-tooltip="
            $t('challenges.challenge_templates.create_template_from_challenge')
          "
        >
          <OpenTemplatesIcon class="create_challenge_icon" />
        </div>
      </div>
    </div>
    <div class="chains_list">
      <ChallengeChainCard
        v-for="item in challengeChains"
        :challengeChainInfo="item"
      />
    </div>
  </div>
</template>

<script>
import ChallengeChainCard from "@/components/ChallengeChainsElements/ChallengeChainCard.vue";
import CreateChallengeChain from "@/components/ChallengeChainsElements/CreateChallengeChain.vue";
import AddCategoryIcon from "@/components/Icons/ChallengesIcons/AddCategoryIcon.vue";
import OpenTemplatesIcon from "@/components/Icons/ChallengesIcons/OpenTemplatesIcon.vue";
import { API_URIS } from "@/constants/api";
import { useStore as useProfileStore } from "@/store/profile";
import axios from "axios";
import { mapStores } from "pinia";
import Loading from "vue3-loading-overlay";

export default {
  name: "ChallengeChains",
  components: {
    CreateChallengeChain,
    ChallengeChainCard,
    Loading,
    OpenTemplatesIcon,
    AddCategoryIcon,
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
      chainCreationEnabled: false,
      challengeChains: [],

      isLoading: false,
      stopFetching: false,
      offset: 1,
      limit: 20,
    };
  },
  mounted() {},
  computed: {
    ...mapStores(useProfileStore),
  },
  watch: {
    isLoading: {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      },
    },
    "profileStore.profileInfo": {
      handler(newVal) {
        if (newVal) {
          this.getChainsList();
        }
      },
      immediate: true,
    },
  },
  methods: {
    goToChallengeTemplates() {
      this.$router.push("/challenge_templates");
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
    openChainCreation() {
      this.chainCreationEnabled = true;
    },
    chainCreationCancelled() {
      this.chainCreationEnabled = false;
    },
    challengeChainCreated() {
      this.chainCreationEnabled = false;
      this.challengeChains = [];
      this.offset = 1;
      this.stopFetching = false;
      this.getChainsList();
    },
    async getChainsList() {
      try {
        this.isLoading = true;
        let params = {
          offset: this.offset,
          limit: this.limit,
        };
        const response = await axios.get(
          API_URIS.challengeGroups.replace(
            "organization_id",
            this.profileStore.profileInfo.profile.organization_id
          ),
          {
            params,
          }
        );
        if (response.data.data.length < this.limit) {
          this.stopFetching = true;
        }
        this.challengeChains.push(...response.data.data);
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.challenge_chains {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 24px;
  padding: 52px;
  border-radius: 24px 0px 0px 24px;
  margin-bottom: 80px;
  overflow-y: auto;
}
.challenge_chains::-webkit-scrollbar {
  width: 8px;
}
.challenge_chains::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
@media (max-width: 768px) {
  .challenge_chains {
    padding: 24px;
  }
}
.header_text {
  margin-top: 8px;
  text-align: left;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
}

.tabs_and_actions {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.tabs {
  display: flex;
}
.actions {
  display: flex;
  gap: 12px;
}
.action_button {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: underline;
}

.challenges_actions {
  display: flex;
  gap: 12px;
}
.challenge_action {
  padding: 7px 7px 7px 7px;
  border-radius: 8px;
  position: relative; /* Added to position the tooltip */
  z-index: 100;
}
.create_challenge_icon {
  height: 24px;
  width: 24px;
}
::v-deep(.create_challenge_icon > svg) {
  margin-bottom: 5px;
}
.challenge_action:hover {
  cursor: pointer;
}

.challenge_action:hover::before,
.challenge_action:hover::after {
  content: "";
  position: absolute;
  visibility: visible;
  border: solid transparent;
}

.challenge_action:hover::before {
  max-width: 150px;
  white-space: normal;
  content: attr(data-tooltip);
  top: 120%; /* Increase gap between tooltip and icon */
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  color: var(--generalColorWhite);
  background-color: var(--generalContrast);
  border-radius: 4px;
  font-size: 12px;
  visibility: hidden;
  /* white-space: nowrap; */
}

.challenge_action:hover::after {
  top: 110%; /* Adjust arrow positioning */
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-width: 5px;
  border-color: transparent transparent var(--generalContrast) transparent;
  visibility: hidden;
}

.challenge_action[data-tooltip]:hover::before,
.challenge_action[data-tooltip]:hover::after {
  visibility: visible;
}

.chains_list {
  display: flex;
  flex-direction: row;
  gap: 29.5px;
  flex-wrap: wrap;
}
</style>