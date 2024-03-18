<template>
  <div class="filter_challenge_state">
    <vSelect
      class="style-chooser"
      :options="challengeStates"
      :placeholder="
        $t('analyticsPage.adminAnalytics.challengesStats.challengeStatesPlaceholder')
      "
      label="title"
      v-model="selectedChallengeState"
      @option:selected="stateChanged()"
    />
  </div>
</template>

<script>
import { CHALLENGE_STATE } from "@/infrastructure/constants/challenge-state";
import { CHALLENGE_STATES } from "@/infrastructure/data-sources/challenge-states";

import vSelect from "vue-select";

export default {
  name: "FilterByChallengeState",
  components: {
    vSelect,
  },
  data() {
    return {
      selectedChallengeState: null,
    };
  },
  computed: {
    challengeState() {
      return CHALLENGE_STATE;
    },
    challengeStates() {
      return CHALLENGE_STATES(this);
    },
  },
  watch: {
    selectedChallengeState() {
      if (!this.selectedChallengeState) {
        this.$emit("stateCleared");
      }
    },
  },
  methods: {
    stateChanged() {
      this.$emit("challengeStateChanged", this.selectedChallengeState);
    },
  },
};
</script>

<style scoped>
.filter_challenge_state {
  width: 360px;
}
::v-deep(.vs__dropdown-toggle) {
  height: 52px !important;
}
</style>