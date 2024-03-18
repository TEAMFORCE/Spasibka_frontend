<template>
  <div class="challenge_update_card">
    <div class="challenge_update_card_title_wrapper">
      <div class="header_and_steps">
        <h1 class="challenge_update_card_title general-contrast-color">
          {{ $t("challenges.create_challenge.steps") }}
        </h1>
        <h1 class="challenge_update_card_description general-secondary-color">
          {{ $t("challenges.create_challenge.configure_steps_description") }}
        </h1>
        <div class="steps">
          <ChallengeUpdateStepComponent
            v-for="(step, index) in chainSteps"
            :key="index"
            :step="step"
            :index="index"
            :curChallengeID="curChallengeID"
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
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

import vSelect from "vue-select";

import SelectedChallengeIcon from "../Icons/ChallengesIcons/SelectedChallengeIcon.vue";
import UnselectedChallengeIcon from "../Icons/ChallengesIcons/UnselectedChallengeIcon.vue";

import Loading from "vue3-loading-overlay";
import ChallengeUpdateStepComponent from "./ChallengeUpdateStepComponent.vue";
import AddCategoryIcon from "../Icons/ChallengesIcons/AddCategoryIcon.vue";

export default {
  name: "LinkDependencies",
  components: {
    vSelect,
    SelectedChallengeIcon,
    UnselectedChallengeIcon,
    Loading,
    ChallengeUpdateStepComponent,
    AddCategoryIcon,
  },
  props: {
    selectedChallenges: {
      required: true,
      default: [],
    },
    curDependencies: {
      required: true,
      default: [],
    },
    isLoading: {
      required: true,
      default: false,
    },
    stopFetching: {
      required: true,
      default: false,
    },
    chainSteps: {
      required: true,
      default: [],
    },
    curChallengeID: {
      required: true,
      default: 0,
    },
  },
  data() {
    return {
      newlySelectedChallenges: [],
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
    selectedChallenges: {
      handler(newVal) {
        this.newlySelectedChallenges = JSON.parse(JSON.stringify(newVal));
        for (let i = 0; i < this.newlySelectedChallenges?.length; ++i) {
          let curChallenge = this.newlySelectedChallenges[i];
          for (let j = 0; j < this.curDependencies?.length; ++j) {
            let curDependency = this.curDependencies[j];
            if (curChallenge.id === curDependency.dependency_id) {
              curChallenge.selected = true;
              break;
            }
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
  },
  methods: {
    addStep() {
      const newStepTitle = `${this.$t("challenges.create_challenge.step")} ${
        this.chainSteps.length + 1
      }`;
      this.chainSteps.push({ title: newStepTitle, items: [] });
    },
    cancelSelection() {
      this.$emit("goToMainInfo");
    },
    selectChallenges() {
      this.$emit("selectChallenges", this.newlySelectedChallenges);
    },
  },
};
</script>

<style scoped>
.challenge_update_card {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.challenge_update_card_title_wrapper {
  height: 100%;
  width: 100%;
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