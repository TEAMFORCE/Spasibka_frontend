<template>
  <div class="challenges_top_bar general-white-bg">
    <div class="challenges_filters">
      <button
        class="challenge_filter minor-info-secondary-bg general-contrast-color"
        :class="{ active: activeFilter(filter) }"
        v-for="filter in challengeFilters"
        @click="selectFilter(filter)"
      >
        {{ filter.name }}
      </button>
    </div>
    <div class="challenges_actions">
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
        :data-tooltip="$t('challenges.challenge_templates.create_template_from_challenge')"
      >
        <OpenTemplatesIcon class="create_challenge_icon" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useChallengesStore } from "@/store/ChallengesStore/index.js";
import AddCategoryIcon from "../Icons/ChallengesIcons/AddCategoryIcon.vue";
import OpenTemplatesIcon from "../Icons/ChallengesIcons/OpenTemplatesIcon.vue";

export default {
  name: "ChallengesTopBar",
  components: { AddCategoryIcon, OpenTemplatesIcon },
  data() {
    return {
      challengeChainsOpened: false,
    };
  },
  computed: {
    ...mapStores(useChallengesStore),
    challengeFilters() {
      let filters = [...this.challengesStore?.challengesFilters];
      // filters.push({
      //   name: this.$t("challenges.challenge_chains.challenge_chains")
      // })
      return filters;
    },
    challengesActions() {
      let actions = [];
      if (!this.challengesStore.challengeChainsOpened) {
        actions.push({
          name: this.$t("challenges.create_challenge_text"),
          onClick: () => {
            this.challengesStore.createChallengeEnabled = true;
          },
        });
      } else {
        actions.push({
          name: this.$t("challenges.challenge_chains.create_challenge_chain"),
          onClick: () => {
            this.challengesStore.createChallengeChainEnabled = true;
          },
        });
      }
      actions.push({
        name: this.$t("challenges.templates"),
        onClick: () => {
          this.$router.push("/challenge_templates");
        },
      });
      return actions;
    },
  },
  methods: {
    activeFilter(filter) {
      if (!this.challengesStore.challengeChainsOpened) {
        return filter.name == this.challengesStore?.selectedFilter.name;
      } else {
        return (
          filter.name ===
          this.$t("challenges.challenge_chains.challenge_chains")
        );
      }
    },
    selectFilter(filter) {
      if (
        filter.name !== this.$t("challenges.challenge_chains.challenge_chains")
      ) {
        this.challengesStore.selectFilter(filter);
        this.challengesStore.challengeChainsOpened = false;
        this.$emit("filterChanged", filter.paramValue);
      } else {
        this.challengesStore.challengeChainsOpened = true;
      }
    },
  },
};
</script>

<style scoped>
.challenges_top_bar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.challenges_filters {
  display: flex;
  gap: 8px;
}
.challenge_filter {
  border-radius: 12px;
  padding: 8px 14px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.challenge_filter.active {
  color: var(--generalColorWhite);
  background-color: var(--generalBrand);
}

.challenges_actions {
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
</style>
