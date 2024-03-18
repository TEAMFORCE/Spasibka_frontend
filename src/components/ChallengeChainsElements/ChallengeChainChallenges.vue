<template>
  <div class="challenge_chains general-white-bg" ref="scrollContainer">
    <div class="chain_challenges">
      <div class="current_step" v-for="step in chainChallengesSorted">
        <div class="current_step_header">
          <div class="current_step_description general-contrast-color">
            <StepCompletedIcon class="step_status_icon" />
            {{ step.title }}
          </div>
          <SectionsCategoryOpenerIcon
            @click="step.opened ^= true"
            class="step_opener_icon"
            :class="{ opened: !step.opened }"
          />
        </div>
        <carousel
          v-if="step.opened"
          :itemsToScroll="1"
          :breakpoints="breakpoints()"
        >
          <slide v-for="slide in step.items" :key="slide">
            <ChallengeChainChallengeCard :challenge="slide" />
          </slide>
          <template #addons>
            <navigation />
            <!-- <pagination /> -->
          </template>
        </carousel>
      </div>
    </div>
  </div>
</template>

<script>
import ChallengeChainCard from "@/components/ChallengeChainsElements/ChallengeChainCard.vue";
import CreateChallengeChain from "@/components/ChallengeChainsElements/CreateChallengeChain.vue";
import { API_URIS } from "@/constants/api";
import { useStore as useProfileStore } from "@/store/profile";
import axios from "axios";
import { mapStores } from "pinia";
import Loading from "vue3-loading-overlay";
import ChallengeChainChallengeCard from "@/components/ChallengeChainsElements/ChallengeChainChallengeCard.vue";
import SectionsCategoryOpenerIcon from "../Icons/ChallengesIcons/SectionsCategoryOpenerIcon.vue";
import StepCompletedIcon from "../Icons/ChallengesIcons/StepCompletedIcon.vue";

import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

export default {
  name: "ChallengeChainChallenges",
  props: {
    scrolledToBottom: {
      required: true,
    },
  },
  components: {
    CreateChallengeChain,
    ChallengeChainCard,
    Loading,
    ChallengeChainChallengeCard,
    SectionsCategoryOpenerIcon,
    StepCompletedIcon,
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  data() {
    return {
      challengeChains: [],
      chainChallengesSorted: [],

      isLoading: false,
      stopFetching: false,
      offset: 1,
      limit: 10000,
    };
  },
  mounted() {},
  computed: {
    ...mapStores(useProfileStore),
  },
  watch: {
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
    assignSteps() {
      let maxStep = 0;
      for (let i = 0; i < this.challengeChains.length; ++i) {
        maxStep = Math.max(maxStep, this.challengeChains[i].step);
      }
      for (let i = 0; i < maxStep; ++i) {
        this.chainChallengesSorted.push({
          title: this.$t("challenges.create_challenge.step") + " " + (i + 1),
          items: [],
          opened: true,
        });
      }
      for (let i = 0; i < this.challengeChains.length; ++i) {
        let curChallengeStep = this.challengeChains[i].step - 1;
        if (curChallengeStep === -1) continue;
        this.chainChallengesSorted[curChallengeStep].items.push(
          this.challengeChains[i]
        );
      }
    },
    async getChainsList() {
      try {
        this.isLoading = true;
        let params = {
          offset: this.offset,
          limit: this.limit,
          group_id: this.$route.params.id,
        };
        const response = await axios.get(API_URIS.challengesUpdate, {
          params,
        });
        if (response.data.data.length < this.limit) {
          this.stopFetching = true;
        }
        this.challengeChains.push(...response.data.data);
        this.isLoading = false;
        this.assignSteps();
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
  height: 100vh;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  border-radius: 24px 0px 0px 24px;
  margin-bottom: 80px;
  /* overflow-y: auto; */
}
@media (max-width: 768px) {
  .challenge_chains {
    padding: 24px;
  }
}
.chain_challenges {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.current_step {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.current_step_header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.current_step_description {
  align-items: center;
  display: flex;
  gap: 10px;
  font-family: "Ubuntu";
  font-size: 24px;
  font-weight: 500;
  line-height: 36px;
  text-align: left;
}
.step_status_icon {
  height: 32px;
}
.step_opener_icon {
  cursor: pointer;
  height: 24px;
}
.step_opener_icon.opened {
  transform: rotate(180deg);
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
.challenges_carousel {
  display: flex;
  flex-direction: row;
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
.chains_list {
  display: flex;
  gap: 29.5px;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>