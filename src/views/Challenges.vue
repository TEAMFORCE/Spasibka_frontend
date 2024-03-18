<template>
  <div
    class="challenges general-white-bg"
    v-scroll-end="handleScrollEnd"
    ref="scrollContainer"
  >
    <CreateChallenge
      v-if="challengesStore.createChallengeEnabled"
      @createChallengeCancel="createChallengeCancel"
    />
    <CreateChallengeChain v-if="challengesStore.createChallengeChainEnabled" />
    <Loading
      class="spinner_loader"
      :active="challengesStore.isLoading"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <div class="header_and_link_to_chains">
      <h1 class="header_text general-contrast-color">
        {{ $t("challenges.challenges") }}
      </h1>
    </div>
    <ChallengesTopBar
      class="challenges_top_bar_component"
      @filterChanged="updateChainsList"
    />
    <div class="chains_list">
      <div class="chains_list_header">
        <h1 class="header_text">
          {{ $t("challenges.challenge_chains.challenge_chains") }}
        </h1>
        <button
          class="show_all_chains transparent-bg general-brand-color"
          @click="goToChallengeChains"
        >
          {{ $t("challenges.challenge_chains.show_all") }}
        </button>
      </div>
      <carousel :itemsToScroll="1" :breakpoints="breakpoints">
        <slide v-for="slide in chainsList" :key="slide">
          <ChallengeChainCard :challengeChainInfo="slide" />
        </slide>
        <template #addons>
          <navigation />
        </template>
      </carousel>
    </div>
    <div class="challenges_list_wrapper">
      <div class="challenges_list_wrapper_header">
        <h1 class="challenges_small_header">
          {{ $t("challenges.challenges") }}
        </h1>
        <button
          class="show_all_chains transparent-bg general-brand-color"
          @click="goToChallenges"
        >
          {{ $t("challenges.challenge_chains.show_all") }}
        </button>
      </div>
      <ChallengesList
        v-if="!challengesStore?.challengeChainsOpened"
        class="challenges_list_component"
      />
      <ChallengeChainsList v-else />
    </div>
  </div>
</template>

<script>
import Defer from "@/mixins/defer";

import ChallengesTopBar from "@/components/ChallengesElements/ChallengesTopBar.vue";
import ChallengesList from "@/components/ChallengesElements/ChallengesList.vue";
import CreateChallenge from "@/components/ChallengesElements/CreateChallenge.vue";
import CreateChallengeChain from "@/components/ChallengeChainsElements/CreateChallengeChain.vue";
import ChallengeChainsList from "@/components/ChallengeChainsElements/ChallengeChainsList.vue";
import Loading from "vue3-loading-overlay";

import { mapStores } from "pinia";
import { useStore as useChallengesStore } from "@/store/ChallengesStore/index";
import { useStore as useProfileStore } from "@/store/profile";
import ChallengeChainCard from "@/components/ChallengeChainsElements/ChallengeChainCard.vue";

import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { API_URIS } from "@/constants/api";
import axios from "axios";

export default {
  name: "Challenges",
  components: {
    ChallengesTopBar,
    ChallengesList,
    ChallengeChainsList,
    CreateChallenge,
    CreateChallengeChain,
    Loading,
    ChallengeChainCard,
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  mixins: [Defer()],
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
      chainsList: [],
    };
  },
  mounted() {
    this.challengesStore.selectFilter(this.challengesStore.selectedFilter);
    this.$nextTick(() => {
      this.ensureScrollable();
    });
  },
  watch: {
    "challengesStore.isLoading": {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      },
    },
    "challengesStore.selectedFilter": {
      handler() {
        if (this.challengesStore.challengesList.length == 0) {
          setTimeout(() => this.ensureScrollable(), 300);
        }
      },
    },
    "challengesStore.createChallengeEnabled": {
      handler(newVal) {
        if (!newVal) {
          this.createChallengeCancel();
        }
      },
    },
    "profileStore.profileInfo.profile": {
      handler() {
        this.updateChainsList();
      },
      immediate: true,
    },
  },
  computed: {
    ...mapStores(useChallengesStore),
    ...mapStores(useProfileStore),
    breakpoints() {
      return {
        4000: { itemsToShow: 10, snapAlign: "start" },
        3700: { itemsToShow: 9, snapAlign: "start" },
        3300: { itemsToShow: 8, snapAlign: "start" },
        2900: { itemsToShow: 7, snapAlign: "start" },
        2550: { itemsToShow: 6, snapAlign: "start" },
        2200: { itemsToShow: 5, snapAlign: "start" },
        1800: { itemsToShow: 4, snapAlign: "start" },
        1450: { itemsToShow: 3, snapAlign: "start" },
        830: { itemsToShow: 2, snapAlign: "start" },
        320: { itemsToShow: 1, snapAlign: "start" },
      };
    },
  },
  methods: {
    goToChallengeChains() {
      this.$router.push("/challenge_chains");
    },
    goToChallenges() {
      this.$router.push("/all_challenges");
    },
    async updateChainsList(filter) {
      try {
        let params = {
          offset: 1,
          limit: 15,
          current_state: this.challengesStore?.selectedFilter?.paramValue,
        };
        if (filter) {
          params.current_state = filter;
        }
        let orgID = this.profileStore?.profileInfo?.profile?.organization_id;
        if (orgID) {
          const response = await axios.get(
            API_URIS.challengeGroups.replace("organization_id", orgID),
            {
              params,
            }
          );
          this.chainsList = response.data.data;
        }
      } catch (err) {
        throw err;
      }
    },
    createChallengeCancel() {
      this.challengesStore.createChallengeEnabled = false;
      this.challengesStore.selectFilter(this.challengesStore.selectedFilter);
    },
    positionLoader() {
      const el = this.$refs.scrollContainer;
      const rect = el.getBoundingClientRect();

      const loaderEl = this.$refs.spinnerLoader.$el;
      loaderEl.style.position = "fixed";
      loaderEl.style.top = `${rect.top}px`;
      loaderEl.style.left = `${rect.left}px`;
      loaderEl.style.width = `${rect.width}px`;
      loaderEl.style.height = `${rect.height}px`;
    },
    handleScrollEnd() {
      if (
        !this.challengesStore.isLoading &&
        !this.challengesStore.stopFetching &&
        !this.challengesStore.challengeChainsOpened
      ) {
        this.challengesStore.fetchOlderChallenges().then(() => {
          this.ensureScrollable();
        });
      }
    },
    ensureScrollable() {
      if (!this.challengesStore.isLoading) {
        if (!this.challengesStore.stopFetching) {
          const el = this.$refs.scrollContainer;
          if (el?.clientHeight >= el?.scrollHeight) {
            // this.challengesStore.fetchOlderChallenges().then(() => {
            //   this.ensureScrollable();
            // });
            this.challengesStore.fetchOlderChallenges();
          }
        }
      } else {
        setTimeout(() => this.ensureScrollable(), 300);
      }
    },
  },
};
</script>

<style scoped>
.challenges {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  padding: 52px;
  border-radius: 24px 0 0 0;
  overflow-y: auto;
  overflow-x: hidden;
}
.challenges::-webkit-scrollbar {
  width: 8px;
}
.challenges::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
@media (max-width: 768px) {
  .challenges {
    padding: 24px;
  }
}
.header_and_link_to_chains {
  display: flex;
  justify-content: space-between;
}
.challenge_action {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.28px;
  text-decoration-line: underline;
}
.challenge_action:hover {
  cursor: pointer;
}
.header_text {
  text-align: left;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
}
::v-deep(.carousel__prev) {
  width: 44px;
  height: 44px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 100%;
  left: -30px;
}
::v-deep(.carousel__next) {
  width: 44px;
  height: 44px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 100%;
  right: -30px;
}
::v-deep(.carousel__prev.carousel__prev--disabled) {
  display: none !important;
}
::v-deep(.carousel__next.carousel__next--disabled) {
  display: none !important;
}
::v-deep(.carousel__track) {
  margin: 0;
}
::v-deep(.carousel__viewport) {
  overflow: visible;
}
::v-deep(.carousel__slide) {
  justify-content: flex-start;
  align-items: stretch;
  width: 377px !important;
}
.show_all_chains {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  text-align: right;
}
.chains_list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.chains_list_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.challenges_list_wrapper_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.challenges_small_header {
  margin-top: 32px;
  margin-bottom: 12px;
  font-family: "Ubuntu";
  font-size: 24px;
  font-weight: 500;
  line-height: 36px;
  text-align: left;
}
</style>