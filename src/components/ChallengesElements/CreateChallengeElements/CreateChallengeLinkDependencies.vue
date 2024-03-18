<template>
  <div class="challenge_update_card general-white-bg">
    <div class="challenge_update_card_title_wrapper">
      <div class="header_and_steps">
        <h1 class="challenge_update_card_title general-contrast-color">
          {{ $t("challenges.create_challenge.steps") }}
        </h1>
        <h1 class="challenge_update_card_description general-secondary-color">
          {{ $t("challenges.create_challenge.configure_steps_description") }}
        </h1>
        <div class="steps">
          <StepComponent
            v-for="(step, index) in steps"
            :key="index"
            :step="step"
            :index="index"
          />
        </div>
      </div>
      <div class="challenge_update_card_buttons">
        <button
          @click="addStep"
          class="add_step general-brand-bg general-white-color"
        >
          <AddCategoryIcon
            class="add_step_icon"
            :currentColor="'--generalColorWhite'"
          />
          {{ this.$t("challenges.create_challenge.add_step") }}
        </button>
        <button class="challenge_button _save" @click="selectChallenges">
          {{ $t("challenges.challenge_chains.back") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";
import { useStore as useProfileStore } from "@/store/profile";

import Datepicker from "@vuepic/vue-datepicker";

import SelectedChallengeIcon from "@/components/Icons/ChallengesIcons/SelectedChallengeIcon.vue";
import UnselectedChallengeIcon from "@/components/Icons/ChallengesIcons/UnselectedChallengeIcon.vue";
import StepComponent from "./StepComponent.vue";

import Loading from "vue3-loading-overlay";
import AddCategoryIcon from "@/components/Icons/ChallengesIcons/AddCategoryIcon.vue";

export default {
  name: "CreateChallengeLinkDependencies",
  components: {
    Datepicker,
    SelectedChallengeIcon,
    UnselectedChallengeIcon,
    Loading,
    StepComponent,
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
  mounted() {
    this.getChallengesList();
  },
  data() {
    return {
      steps: [],
      offset: 1,
      limit: 100,
      isLoading: false,
      stopFetching: false,
    };
  },
  watch: {
    isLoading: {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      },
    },
    steps: {
      handler() {
        for (let i = 0; i < this.steps.length; ++i) {
          let stepIsFound = false;
          for (let j = 0; j < this.steps[i].items.length; ++j) {
            if (this.steps[i].items[j].id === "new") {
              this.createChallengeStore.currentChainStep = i + 1;
              stepIsFound = true;
              break;
            }
          }
          if (stepIsFound) break;
        }
      },
      deep: true,
    },
    "createChallengeStore.challengeName": {
      handler(newVal) {
        for (let i = 0; i < this.steps.length; ++i) {
          let nameChanged = false;
          for (let j = 0; j < this.steps[i].items.length; ++j) {
            if (this.steps[i].items[j].id === "new") {
              this.steps[i].items[j].name = newVal;
              nameChanged = true;
              break;
            }
          }
          if (nameChanged) break;
        }
      },
    },
    "createChallengeStore.groups": {
      handler(newVal) {
        if (newVal) {
          this.createChallengeStore.dependencies = [];
          this.offset = 1;
          this.isLoading = false;
          this.stopFetching = false;
          this.getChallengesList();
        }
      },
      deep: true,
    },
    // "profileStore.profileInfo": {
    //   handler(newVal) {
    //     if (newVal) {
    //       this.getChallengesList();
    //     }
    //   },
    //   immediate: true
    // }
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
    ...mapStores(useProfileStore),
  },
  methods: {
    addStep() {
      const newStepTitle = `${this.$t("challenges.create_challenge.step")} ${
        this.steps.length + 1
      }`;
      this.steps.push({ title: newStepTitle, items: [] });
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
        this.getChallengesList();
      }
    },
    selectChallenges() {
      if (this.createChallengeStore.simplifiedCreation) {
        this.createChallengeStore.selectedTab = "settings";
      } else {
        this.createChallengeStore.selectedTab = "mainInputs";
      }
    },
    assignSteps() {
      this.steps = [];
      let challenges = this.createChallengeStore.dependencies;
      let maxStep = 0;
      for (let i = 0; i < challenges.length; ++i) {
        let curItem = challenges[i];
        maxStep = Math.max(curItem.step, maxStep);
      }
      if (maxStep === 0) maxStep++;
      for (let i = 0; i < maxStep; ++i) {
        this.steps.push({
          title: this.$t("challenges.create_challenge.step") + " " + (i + 1),
          items: [],
        });
      }
      for (let i = 0; i < challenges.length; ++i) {
        let curStep = challenges[i].step;
        if (curStep > 0) curStep--;
        this.steps[curStep].items.push(challenges[i]);
      }
      this.steps[0].items.push({
        id: "new",
        name: this.createChallengeStore.challengeName,
      });
    },
    async getChallengesList() {
      try {
        this.isLoading = true;
        let groupID = -1;
        for (let i = 0; i < this.createChallengeStore?.groups?.length; ++i) {
          let curGroup = this.createChallengeStore.groups[i];
          if (curGroup.selected) {
            groupID = curGroup.id;
            break;
          }
        }
        if (groupID === -1) return;
        let params = {
          offset: this.offset,
          limit: this.limit,
          group_id: groupID,
        };
        const response = await axios.get(API_URIS.challengesUpdate, {
          params,
        });
        this.createChallengeStore.dependencies.push(...response.data.data);
        if (response.data.data.length < this.limit) {
          this.stopFetching = true;
        }
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  overflow-y: auto;
}
.header_and_steps {
  width: 95%;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.challenge_update_card_title {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
}
.challenge_update_card_description {
  font-family: "SF Pro Text";
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  text-align: left;
}
.steps {
  width: 100%;
  margin-top: 46px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: visible;
}
.challenge_update_card_buttons {
  position: absolute;
  bottom: 24px;
  left: 24px;
  width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.add_step {
  align-items: center;
  padding: 8px 14px;
  border-radius: 12px;
  align-self: center;
  display: flex;
  justify-content: space-between;
  width: 166px;
  gap: 10px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}
.add_step_icon {
  height: 24px;
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