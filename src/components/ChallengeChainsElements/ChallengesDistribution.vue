<template>
  <div class="challenges_distribution_wrapper">
    <div class="challenges_distribution general-white-bg">
      <div class="headers_and_challenges">
        <div class="challenges_addition_headers">
          <h1 class="challenges_addition_main_header general-contrast-color">
            {{ $t("challenges.challenge_chains.steps") }}
          </h1>
          <h1
            class="challenges_addition_additional_header general-secondary-color"
          >
            {{ $t("challenges.challenge_chains.configure_steps_order") }}
          </h1>
        </div>
      </div>
      <div class="steps">
        <ChallengesDistributionSteps
          v-for="(step, index) in currentConfiguredChallenges"
          :key="index"
          :step="step"
          :index="index"
        />
      </div>
      <button 
        @click="addStep"
        class="add_step general-brand-bg general-white-color"
      > 
        <AddCategoryIcon class="add_step_icon" :currentColor="'--generalColorWhite'"/>
        {{ this.$t("challenges.create_challenge.add_step") }}
      </button>
      <div class="action_buttons general-white-bg">
        <button
          @click="saveConfiguredChallenges"
          class="action_button general-brand-bg general-white-color"
        >
          {{ $t("challenges.challenge_chains.save") }}
        </button>
        <button
          @click="cancelConfiguredChallenges"
          class="action_button brand-secondary-bg general-brand-color"
        >
          {{ $t("challenges.challenge_chains.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AddCategoryIcon from "../Icons/ChallengesIcons/AddCategoryIcon.vue";
import ChallengesDistributionSteps from "./ChallengesDistributionSteps.vue";

export default {
  name: "ChallengesDistribution",
  components: { ChallengesDistributionSteps, AddCategoryIcon },
  props: {
    chainSteps: {
      required: true,
      default: [],
    },
  },
  data() {
    return {
      currentConfiguredChallenges: [],
    };
  },
  mounted() {
    this.currentConfiguredChallenges = JSON.parse(JSON.stringify(this.chainSteps));
  },
  methods: {
    addStep() {
      const newStepTitle = `${this.$t("challenges.create_challenge.step")} ${this.currentConfiguredChallenges.length + 1}`;
      this.currentConfiguredChallenges.push({ title: newStepTitle, items: [] });
    },
    saveConfiguredChallenges() {
      this.$emit("saveConfiguredChallenges", this.currentConfiguredChallenges);
    },
    cancelConfiguredChallenges() {
      this.$emit("cancelConfiguredChallenges");
    },
  },
};
</script>

<style scoped>
.challenges_distribution_wrapper {
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

.challenges_distribution {
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
.steps {
  position: relative;
  height: 80%;
  display: flex;
  flex-direction: column;
  /* overflow-x: visible; */
  gap: 8px;
  overflow-y: auto;
  /* overflow: visible; */
}
.add_step {
  z-index: 10001;
  position: absolute;
  bottom: 132px;
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
.action_buttons {
  box-shadow: 0px -9px 24px 0px rgba(138, 138, 138, 0.1);
  width: 100%;
  /* box-sizing: ; */
  margin: 0px -32px -32px -32px;
  /* position: absolute;
  bottom: 0;
  left: 0; */
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
