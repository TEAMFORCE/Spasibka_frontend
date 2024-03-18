<template>
  <div
    class="all_challenges_page general-white-bg"
    v-scroll-end="handleScrollEnd"
  >
    <CreateChallenge
      v-if="challengesStore.createChallengeEnabled"
      @createChallengeCancel="createChallengeCancel"
    />
    <div class="all_challenges_page_header">
      <h1 class="all_challenges_page_title">
        {{ $t("challenges.allChallenges") }}
      </h1>
      <div class="challenge_actions">
        <div
          class="challenge_action brand-secondary-bg"
          @click="challengesStore.createChallengeEnabled = true"
          :data-tooltip="$t('challenges.create_challenge.create_challenge')"
        >
          <AddCategoryIcon class="create_challenge_icon" />
        </div>
        <div
          class="challenge_action brand-secondary-bg"
          @click="$router.push('/challenge_templates')"
          :data-tooltip="
            $t('challenges.challenge_templates.create_template_from_challenge')
          "
        >
          <OpenTemplatesIcon class="create_challenge_icon" />
        </div>
      </div>
    </div>

    <div class="all_challenges_list_wrapper">
      <ChallengeItem
        v-for="challenge in challengesList"
        :challenge="challenge"
      />
      <div class="content_loading" v-if="!stopFetching">
        <span class="loader"></span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { mapStores } from "pinia";
import { useStore as useChallengesStore } from "@/store/ChallengesStore/index";
import { useStore as useProfileStore } from "@/store/profile";

import ChallengeItem from "@/components/ChallengesElements/ChallengesListElements/ChallengeItem.vue";
import CreateChallenge from "@/components/ChallengesElements/CreateChallenge.vue";
import AddCategoryIcon from "@/components/Icons/ChallengesIcons/AddCategoryIcon.vue";
import OpenTemplatesIcon from "@/components/Icons/ChallengesIcons/OpenTemplatesIcon.vue";

export default {
  name: "AllChallenges",
  components: {
    ChallengeItem,
    CreateChallenge,
    AddCategoryIcon,
    OpenTemplatesIcon,
  },
  directives: {
    scrollEnd: {
      mounted(el, binding) {
        const handler = () => {
          let tolerance = 0.1;
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
      stopFetching: false,
      challengesList: [],
    };
  },
  computed: {
    ...mapStores(useChallengesStore),
    ...mapStores(useProfileStore),
    windowWidth() {
      return window.innerWidth;
    },
    windowHeight() {
      return window.innerHeight;
    },
  },
  watch: {
    "challengesStore.createChallengeEnabled": {
      handler(newVal) {
        if (!newVal) {
          this.createChallengeCancel();
        }
      },
    },
  },
  methods: {
    async getChallenges() {
      if (!this.stopFetching) {
        try {
          const challengeCardSize = 357 * 486;
          let limit = Math.max(
            15,
            Math.floor(
              (this.windowWidth * this.windowHeight) / challengeCardSize
            ) + 5
          );
          if (this.windowWidth < 1281) {
            limit = 20;
          }
          let params = {
            offset: this.offset,
            limit: limit,
          };
          let response = await axios.get(API_URIS.challengesUpdate, { params });
          if (this.offset == 1) {
            this.challengesList = response.data.data;
          } else {
            this.challengesList.push(...response.data.data);
          }
          if (response.data.data.length < limit) {
            this.stopFetching = true;
          }
          this.offset += 1;
        } catch (err) {
          throw err;
        }
      }
    },
    handleScrollEnd() {
      this.getChallenges();
    },
    createChallengeCancel() {
      this.challengesStore.createChallengeEnabled = false;
    },
  },
  mounted() {
    this.getChallenges();
  },
};
</script>

<style scoped>
.all_challenges_page {
  position: relative;
  width: 100%;
  gap: 20px;
  padding: 52px;
  border-radius: 24px 0 0 0;
  overflow-y: auto;
  overflow-x: hidden;
}
@media (max-width: 768px) {
  .all_challenges_page {
    padding: 24px;
  }
}
.all_challenges_page::-webkit-scrollbar {
  width: 8px;
}
.all_challenges_page::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.all_challenges_page_header {
  display: flex;
  justify-content: space-between;
}
.all_challenges_page_title {
  text-align: left;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  color: var(--generalContrast);
  cursor: default;
}
.challenge_actions {
  display: flex;
  gap: 12px;
}
.challenge_action {
  padding: 7px 7px 7px 7px;
  border-radius: 8px;
  position: relative; /* Added to position the tooltip */
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
.all_challenges_list_wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 24px 0 0 0;
}
</style>