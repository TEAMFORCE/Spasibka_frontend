<template>
  <div class="create_challenge_main_inputs general-white-bg">
    <div class="create_challenge_headers">
      <h1 class="create_challenge_main_header general-contrast-color">
        {{ $t("challenges.create_challenge.settings") }}
      </h1>
      <h1 class="create_challenge_additional_header general-secondary-color">
        {{ $t("challenges.create_challenge.settings_header") }}
      </h1>
    </div>
    <button
      v-if="createChallengeStore.simplifiedCreation && !fromTemplate"
      class="challenge_chain brand-secondary-bg general-brand-color"
      @click="goToGroupsLinking"
    >
      {{
        $t("challenges.challenge_chains.challenge_chain") + selectedGroupsCount
      }}
    </button>
    <button
      v-if="
        createChallengeStore.simplifiedCreation && selectedGroupsCountNumber
      "
      class="dependencies general-brand-bg general-white-color"
      @click="goToDependenciesLinking"
    >
      {{
        $t("challenges.create_challenge.configure_steps") +
        selectedDependenciesCount
      }}
    </button>
    <CreateChallengeMultipleReports
      class="create_challenge_multiple_reports_component"
    />
    <CreateChallengeShowParticipants
      v-show="createChallengeStore.selectedChallengeType.type === 'default'"
      class="create_challenge_show_participants_component"
    />
    <CreateChallengeDeferredLaunch
      v-if="!createChallengeStore.simplifiedCreation"
      class="create_challenge_deferred_launch_component"
    />
    <CreateChallengeChallengeType
      class="create_challenge_challenge_type_component"
    />
    <button
      class="create_challenge_button brand-secondary-bg"
      @click="createChallengeStore.selectedTab = 'mainInputs'"
    >
      <h1 class="create_challenge_button_text general-brand-color">
        {{ $t("challenges.create_challenge.back") }}
      </h1>
    </button>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

import CreateChallengeChallengeType from "./CreateChallengeParticularSettings/CreateChallengeChallengeType.vue";
import CreateChallengeDeferredLaunch from "./CreateChallengeParticularSettings/CreateChallengeDeferredLaunch.vue";
import CreateChallengeMultipleReports from "./CreateChallengeParticularSettings/CreateChallengeMultipleReports.vue";
import CreateChallengeShowParticipants from "./CreateChallengeParticularSettings/CreateChallengeShowParticipants.vue";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "CreateChallengeSettings",
  components: {
    CreateChallengeChallengeType,
    CreateChallengeDeferredLaunch,
    CreateChallengeMultipleReports,
    CreateChallengeShowParticipants,
  },
  props: {
    fromTemplate: {
      defaultfalse: false,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapStores(useCreateChallengeStore),
    selectedGroupsCountNumber() {
      let selectedCount = 0;
      for (let i = 0; i < this.createChallengeStore?.groups?.length; ++i) {
        let curGroup = this.createChallengeStore?.groups[i];
        if (curGroup.selected) {
          selectedCount++;
        }
      }
      return selectedCount;
    },
    selectedGroupsCount() {
      let selectedCount = 0;
      for (let i = 0; i < this.createChallengeStore?.groups?.length; ++i) {
        let curGroup = this.createChallengeStore?.groups[i];
        if (curGroup.selected) {
          selectedCount++;
        }
      }
      if (selectedCount) {
        return ` (${selectedCount})`;
      }
      return "";
    },
    selectedDependenciesCount() {
      let selectedCount = 0;
      for (
        let i = 0;
        i < this.createChallengeStore?.dependencies?.length;
        ++i
      ) {
        let curDependency = this.createChallengeStore?.dependencies[i];
        if (curDependency.selected) {
          selectedCount++;
        }
      }
      if (selectedCount) {
        return ` (${selectedCount})`;
      }
      return "";
    },
  },
  methods: {
    goToGroupsLinking() {
      this.createChallengeStore.selectedTab = "chains";
    },
    goToDependenciesLinking() {
      try {
        if (!this.createChallengeStore.challengeName) {
          throw new Error(
            this.$t("challenges.create_challenge.enter_challenge_name")
          );
        }
        this.createChallengeStore.selectedTab = "dependencies";
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.create_challenge_main_inputs {
  width: 100%;
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
.challenge_chain {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
.dependencies {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
/* @media (max-height: 1000px) {
  .create_challenge_main_inputs {
    margin-top: 50px;
    margin-bottom: 150px;
  }
}
@media (max-height: 825px) {
  .create_challenge_main_inputs {
    margin-top: 75px;
    margin-bottom: 150px;
  }
}
@media (max-height: 735px) {
  .create_challenge_main_inputs {
    margin-top: 125px;
    margin-bottom: 150px;
  }
}
@media (max-height: 625px) {
  .create_challenge_main_inputs {
    margin-top: 175px;
    margin-bottom: 150px;
  }
}
@media (max-height: 505px) {
  .create_challenge_main_inputs {
    margin-top: 225px;
    margin-bottom: 150px;
  }
} */
.create_challenge_headers {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
.create_challenge_main_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
}
.create_challenge_additional_header {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
}
.create_challenge_multiple_reports_component {
  margin-top: 8px;
}
.create_challenge_button {
  margin-top: 8px;
  flex-grow: 1;
  border-radius: 6px;
  padding: 16px 0px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
.create_challenge_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}
</style>
