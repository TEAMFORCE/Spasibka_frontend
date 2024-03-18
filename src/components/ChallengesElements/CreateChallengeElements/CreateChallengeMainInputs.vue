<template>
  <div class="create_challenge_main_inputs general-white-bg">
    <div
      v-if="!createChallengeStore.simplifiedCreation"
      class="create_challenge_headers"
    >
      <h1 class="create_challenge_main_header general-contrast-color">
        {{ $t("challenges.create_challenge.main_info") }}
      </h1>
      <h1 class="create_challenge_additional_header general-secondary-color">
        {{ $t("challenges.create_challenge.fill_data") }}
      </h1>
    </div>
    <div class="simplified_creation_header" v-else>
      <CloseChallengeCreationIcon
        @click="closeChallengeCreation"
        class="close_challenge_creation"
      />
      <div class="creation_progress">
        <h1 class="creation_progress_text general-contrast-color">
          {{ $t("challenges.create_challenge.challenge_creation") }}
        </h1>
        <h1 class="creation_progress_text general-contrast-color">
          {{
            $t("challenges.create_challenge.step") +
            " " +
            createChallengeStore.challengeCreationStep +
            "/3"
          }}
        </h1>
      </div>
      <h1 class="step_description general-secondary-color">
        {{ stepDescription }}
      </h1>
    </div>
    <CreateChallengeName
      v-if="
        !createChallengeStore.simplifiedCreation ||
        createChallengeStore.challengeCreationStep === 1
      "
      class="create_challenge_name_component"
    />
    <CreateChallengeDescription
      v-if="
        !createChallengeStore.simplifiedCreation ||
        createChallengeStore.challengeCreationStep === 1
      "
      class="create_challenge_description_component"
    />
    <CreateChallengeEndDate
      v-if="
        !createChallengeStore.simplifiedCreation ||
        createChallengeStore.challengeCreationStep === 3
      "
      class="create_challenge_end_date_component"
    />
    <CreateChallengeDeferredLaunch
      v-if="
        createChallengeStore.simplifiedCreation &&
        createChallengeStore.challengeCreationStep === 3
      "
      class="create_challenge_deferred_launch_component"
    />
    <CreateChallengePrizeFund
      v-if="
        !createChallengeStore.simplifiedCreation ||
        createChallengeStore.challengeCreationStep === 2
      "
      class="create_challenge_prize_fund_component"
    />
    <CreateChallengePrizePlaces
      v-if="
        !createChallengeStore.simplifiedCreation ||
        createChallengeStore.challengeCreationStep === 2
      "
      class="create_challenge_prize_places_component"
    />
    <button
      v-if="!createChallengeStore.simplifiedCreation"
      class="challenge_chain brand-secondary-bg general-brand-color"
      @click="goToGroupsLinking"
    >
      {{
        $t("challenges.challenge_chains.challenge_chain") + selectedGroupsCount
      }}
    </button>
    <button
      v-if="
        !createChallengeStore.simplifiedCreation &&
        selectedGroupsCountNumber > 0
      "
      class="dependencies general-brand-bg general-white-color"
      @click="goToDependenciesLinking"
    >
      {{
        $t("challenges.create_challenge.configure_steps") +
        selectedDependenciesCount
      }}
    </button>

    <CreateChallengeSelectSponsor
      v-if="
        accountsVisible &&
        (!createChallengeStore.simplifiedCreation ||
          createChallengeStore.challengeCreationStep === 1)
      "
      class="create_challenge_select_sponsor_component"
    />
    <CreateChallengePhotos
      ref="challengePhotos"
      :class="{
        disabled: createChallengeStore.challengeCreationStep !== 1,
      }"
      @imageCropped="createChallenge"
    />
    <!-- :class="{ disabled: !createChallengeStore.simplifiedCreation ||
    createChallengeStore.challengeCreationStep !== 1, }" -->

    <button
      v-if="
        !createChallengeStore.simplifiedCreation ||
        createChallengeStore.challengeCreationStep === 1
      "
      class="create_challenge_button brand-secondary-bg"
      @click="createChallengeStore.selectedTab = 'settings'"
    >
      <h1 class="create_challenge_button_text general-brand-color">
        {{ $t("challenges.create_challenge.additional_settings") }}
      </h1>
    </button>
    <h1
      v-if="
        createChallengeStore.simplifiedCreation &&
        createChallengeStore.challengeCreationStep === 2
      "
      class="step_description general-secondary-color"
    >
      {{ $t("challenges.create_challenge.second_step_description_prize_fund") }}
    </h1>
    <div class="create_challenge_buttons">
      <button
        v-if="!createChallengeStore.simplifiedCreation"
        class="create_challenge_button general-brand-bg"
        @click="checkPhotos"
      >
        <h1 class="create_challenge_button_text general-white-color">
          {{ $t("challenges.create_challenge.create") }}
        </h1>
      </button>
      <button
        v-else
        class="create_challenge_button general-brand-bg"
        @click="goToNextStep"
      >
        <h1 class="create_challenge_button_text general-white-color">
          {{
            createChallengeStore.challengeCreationStep < 3
              ? $t("challenges.create_challenge.continue")
              : $t("challenges.create_challenge.create")
          }}
        </h1>
      </button>
      <button
        class="create_challenge_button brand-secondary-bg"
        @click="cancelOrProceedBack"
      >
        <h1 class="create_challenge_button_text general-brand-color">
          {{
            createChallengeStore.simplifiedCreation &&
            createChallengeStore.challengeCreationStep > 1
              ? $t("challenges.create_challenge.back")
              : $t("challenges.create_challenge.cancel")
          }}
        </h1>
      </button>
    </div>
    <div class="simplified_creation_toggler general-contrast-color">
      <input
        type="checkbox"
        class="checkbox"
        v-model="createChallengeStore.simplifiedCreation"
      />
      {{ $t("challenges.create_challenge.simplified_creation") }}
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";
import { useStore as useChallengesStore } from "@/store/ChallengesStore/index";
import { useStore as useProfileStore } from "@/store/profile";

import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";
import axios from "axios";

import CreateChallengeName from "./CreateChallengeParticularInputs/CreateChallengeName.vue";
import CreateChallengeDescription from "./CreateChallengeParticularInputs/CreateChallengeDescription.vue";
import CreateChallengeEndDate from "./CreateChallengeParticularInputs/CreateChallengeEndDate.vue";
import CreateChallengePrizeFund from "./CreateChallengeParticularInputs/CreateChallengePrizeFund.vue";
import CreateChallengePrizePlaces from "./CreateChallengeParticularInputs/CreateChallengePrizePlaces.vue";
import CreateChallengeSelectSponsor from "./CreateChallengeParticularInputs/CreateChallengeSelectSponsor.vue";
import CreateChallengePhotos from "./CreateChallengeParticularInputs/CreateChallengePhotos.vue";
import CloseChallengeCreationIcon from "@/components/Icons/ChallengesIcons/CloseChallengeCreationIcon.vue";
import CreateChallengeDeferredLaunch from "./CreateChallengeParticularSettings/CreateChallengeDeferredLaunch.vue";

export default {
  name: "CreateChallengeMainInputs",
  components: {
    CreateChallengeName,
    CreateChallengeDescription,
    CreateChallengeEndDate,
    CreateChallengePrizeFund,
    CreateChallengePrizePlaces,
    CreateChallengeSelectSponsor,
    CreateChallengePhotos,
    CloseChallengeCreationIcon,
    CreateChallengeDeferredLaunch,
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
    ...mapStores(useCreateChallengeStore),
    ...mapStores(useChallengesStore),
    ...mapStores(useProfileStore),
    stepDescription() {
      let step = this.createChallengeStore.challengeCreationStep;
      if (step === 1) {
        return this.$t("challenges.create_challenge.first_step_description");
      } else if (step === 2) {
        return this.$t("challenges.create_challenge.second_step_description");
      } else if (step === 3) {
        return this.$t("challenges.create_challenge.third_step_description");
      } else {
        return "STEP 4";
      }
    },
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
    accountsVisible() {
      let personalAccounts =
        this.createChallengeStore?.challengeCreationSettings?.accounts
          ?.personal_accounts;
      let orgAccounts =
        this.createChallengeStore?.challengeCreationSettings?.accounts
          ?.organization_accounts;
      if (!personalAccounts?.length && !orgAccounts?.length) return false;
      return true;
    },
    userID() {
      return this.profileStore?.profileInfo?.id;
    },
    userOrgID() {
      return this.profileStore?.profileInfo?.profile?.organization_id;
    },
    localStorageKey() {
      return `${this.userID}-${this.userOrgID}-createChallengeForm`;
    },
    createChallengeEnabled() {
      return this.challengesStore.createChallengeEnabled;
    },
    // this.challengesStore.createChallengeEnabled
  },
  methods: {
    blockScroll() {
      document.body.style.overflow = "hidden";
      let wrapper = document.getElementsByClassName("create_challenge_wrapper");
      wrapper[0].style.overflow = "hidden";
    },
    unlockScroll() {
      document.body.style.overflow = "";
      let wrapper = document.getElementsByClassName("create_challenge_wrapper");
      wrapper[0].style.overflow = "";
    },
    cancelOrProceedBack() {
      if (
        this.createChallengeStore.simplifiedCreation &&
        this.createChallengeStore.challengeCreationStep > 1
      ) {
        this.createChallengeStore.challengeCreationStep--;
      } else {
        this.closeChallengeCreation();
        this.challengeTemplatesStore.selectedTemplate = this.challengeTemplate;
      }
    },
    goToNextStep() {
      try {
        if (this.createChallengeStore.challengeCreationStep === 1) {
          if (!this.createChallengeStore.challengeName) {
            throw new Error(
              this.$t("challenges.create_challenge.enter_challenge_name")
            );
          } else if (!this.createChallengeStore.challengeDescription) {
            throw new Error(
              this.$t("challenges.create_challenge.enter_challenge_description")
            );
          }
        } else if (this.createChallengeStore.challengeCreationStep === 2) {
          if (!this.createChallengeStore.challengePrizeFund) {
            throw new Error(
              this.$t("challenges.create_challenge.enter_start_balance")
            );
          } else if (!this.createChallengeStore.challengePrizePlaces) {
            throw new Error(
              this.$t("challenges.create_challenge.enter_prize_places")
            );
          }
        }
        if (this.createChallengeStore.challengeCreationStep < 3) {
          this.createChallengeStore.challengeCreationStep++;
        } else {
          this.checkPhotos();
        }
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
      }
    },
    checkPhotos() {
      let currentPhotos = this.createChallengeStore.challengePhotos;
      if (currentPhotos.length) {
        this.$refs.challengePhotos.openCropper();
      } else {
        this.createChallenge();
      }
    },
    async createChallenge(file) {
      try {
        let formData = new FormData();
        if (!this.createChallengeStore?.challengeName) {
          throw new Error(
            this.$t("challenges.create_challenge.enter_challenge_name")
          );
        }
        if (!this.createChallengeStore?.challengeDescription) {
          throw new Error(
            this.$t("challenges.create_challenge.enter_challenge_description")
          );
        }
        if (!this.createChallengeStore?.challengePrizeFund) {
          throw new Error(
            this.$t("challenges.create_challenge.enter_start_balance")
          );
        }
        if (!this.createChallengeStore?.challengePrizePlaces) {
          throw new Error(
            this.$t("challenges.create_challenge.enter_prize_places")
          );
        }
        formData.append("name", this.createChallengeStore.challengeName);
        formData.append(
          "description",
          this.createChallengeStore.challengeDescription
        );

        let curTimezone = -new Date().getTimezoneOffset() / 60;
        let absoluteOffset = Math.floor(Math.abs(curTimezone));
        let sign = curTimezone < 0 ? "-" : "+";
        curTimezone =
          absoluteOffset < 10 ? "0" + absoluteOffset : absoluteOffset;
        curTimezone = sign + curTimezone + ":00";

        let challengeEndDate = this.createChallengeStore?.challengeEndDate;
        if (challengeEndDate) {
          if (typeof challengeEndDate !== "string") {
            challengeEndDate = challengeEndDate.toISOString();
          }
          challengeEndDate = challengeEndDate.split("T")[0];
          formData.append(
            "end_at",
            challengeEndDate + "T23:59:59" + curTimezone
          );
        }

        let challengeStartDate = this.createChallengeStore?.challengeStartDate;
        if (challengeStartDate && this.createChallengeStore.challengeDeferred) {
          if (typeof challengeStartDate !== "string") {
            challengeStartDate = challengeStartDate.toISOString();
          }
          challengeStartDate = challengeStartDate.split("T")[0];
          formData.append(
            "start_at",
            challengeStartDate + "T00:00:00" + curTimezone
          );
        }
        formData.append(
          "start_balance",
          this.createChallengeStore.challengePrizeFund
        );
        formData.append("parameter_id", 2);
        formData.append(
          "parameter_value",
          this.createChallengeStore.challengePrizePlaces
        );
        let challengeType = this.createChallengeStore?.selectedChallengeType;
        if (challengeType)
          formData.append("challenge_type", challengeType.type);
        let multipleReports = this.createChallengeStore?.multipleReports;
        formData.append("multiple_reports", multipleReports ? "yes" : "no");
        let showParticipants = this.createChallengeStore?.showParticipants;
        if (challengeType.type !== "voting")
          formData.append("show_contenders", showParticipants ? "yes" : "no");
        let selectedSponsor = this.createChallengeStore?.selectedSponsor;
        if (selectedSponsor) formData.append("account_id", selectedSponsor.id);
        for (
          let i = 0;
          i < this.createChallengeStore.challengePhotos.length;
          i++
        ) {
          formData.append(
            "photos",
            this.createChallengeStore.challengePhotos[i]
          );
        }

        if (this.createChallengeStore.currentChainStep > 0) {
          formData.append(
            "step",
            Number(this.createChallengeStore.currentChainStep)
          );
        }
        // let dependencyIDs = [];
        // for (
        //   let i = 0;
        //   i < this.createChallengeStore?.dependencies?.length;
        //   ++i
        // ) {
        //   let curDependency = this.createChallengeStore.dependencies[i];
        //   if (curDependency.selected) {
        //     dependencyIDs.push(curDependency.id);
        //   }
        // }
        // formData.append("dependencies", JSON.stringify(dependencyIDs));
        if (file) {
          formData.append("cropped_photo", file);
        }
        let groupIDs = [];
        for (let i = 0; i < this.createChallengeStore?.groups?.length; ++i) {
          let curGroup = this.createChallengeStore.groups[i];
          if (curGroup.selected) {
            groupIDs.push(curGroup.id);
          }
        }
        formData.append("groups", JSON.stringify(groupIDs));
        const response = await axios.post(API_URIS.challengesUpdate, formData, {
          "Content-Type": "multipart/form-data",
        });
        this.closeChallengeCreation();
        this.clearFormFromLocalStorage();
        notify(
          this.$t("challenges.create_challenge.challenge_successfully_created"),
          "success"
        );
        this.unlockScroll();
        setTimeout(() => {
          this.$router.push("/challenge/" + response.data.id);
        }, 100);
      } catch (err) {
        if (
          err?.response?.data?.errors &&
          err.response.data.errors.startsWith("fill in all steps up to step")
        ) {
          let parts = err.response.data.errors.split(" ");
          let stepNumber = parseInt(parts[parts.length - 1], 10);
          notify(
            this.$t("challenges.create_challenge.fill_the_steps_till") +
              " " +
              stepNumber
          );
        } else if (
          err?.response?.data?.start_at ===
          "Challenge must end at least 5 min after start"
        ) {
          notify(
            this.$t(
              "challenges.create_challenge.start_date_cannot_be_greater_then_end_date"
            )
          );
        } else if (err?.response?.data?.errors) {
          notify(err?.response?.data?.errors);
        } else {
          notify(
            err?.response?.data || err?.message || this.$t("notification.error")
          );
        }
        this.unlockScroll();
        setTimeout(() => {
          throw err;
        }, 100);
      }
    },
    clearFormFromLocalStorage() {
      this.createChallengeStore.resetState();
      localStorage.removeItem(this.localStorageKey);
    },
    closeChallengeCreation() {
      this.challengesStore.createChallengeEnabled = false;
      localStorage.removeItem(this.localStorageKey);
      this.unlockScroll();
      this.createChallengeStore.resetState();
    },
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
  mounted() {
    this.blockScroll();
  },
};
</script>

<style scoped>
.create_challenge_main_inputs {
  width: 100%;
  max-width: 541px;
  height: 80%;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 16px;
  overflow-y: auto;
}
.create_challenge_main_inputs::-webkit-scrollbar {
  width: 30px;
}
.create_challenge_main_inputs::-webkit-scrollbar-thumb {
  background: var(--generalColorGrey);
  background-clip: content-box;
  border: 12px solid transparent;
  border-radius: 20px;
}
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
.simplified_creation_header {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.creation_progress {
  display: flex;
  justify-content: space-between;
}
.creation_progress_text {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
}
.step_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.close_challenge_creation {
  cursor: pointer;
  height: 24px;
  align-self: flex-end;
  margin-top: -20px;
  margin-right: -20px;
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
.create_challenge_name_component {
  margin-top: 8px;
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
.create_challenge_buttons {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.create_challenge_button {
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
.simplified_creation_toggler {
  display: flex;
  align-items: center;
  align-self: center;
  gap: 10px;
}
.disabled {
  position: absolute;
  top: -999999px;
  left: -999999px;
}
</style>