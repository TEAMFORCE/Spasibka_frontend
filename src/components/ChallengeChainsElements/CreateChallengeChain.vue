<template>
  <div class="create_challenge_chain_wrapper">
    <div class="create_challenge_chain general-white-bg">
      <ChallengesAddition
        v-if="challengesAdditionOpened"
        @saveChosenChallenges="saveChosenChallenges"
        @cancelChosenChallenges="cancelChosenChallenges"
        :selectedChallengesList="selectedChallengesList"
      />
      <ChallengesDistribution
        v-if="challengesDistributionOpened"
        :chainSteps="chainSteps"
        @saveConfiguredChallenges="saveConfiguredChallenges"
        @cancelConfiguredChallenges="closeChallengesDistribution"
      />
      <div class="create_challenge_headers">
        <h1 class="create_challenge_main_header general-contrast-color">
          {{ $t("challenges.challenge_chains.main_info") }}
        </h1>
        <h1 class="create_challenge_additional_header general-secondary-color">
          {{
            $t("challenges.challenge_chains.fill_data_about_challenge_chains")
          }}
        </h1>
      </div>
      <div class="input_field_wrapper">
        <div
          v-if="name"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("challenges.challenge_chains.name") }}
        </div>
        <input
          class="name_input general-contrast-color"
          v-model="name"
          :placeholder="$t('challenges.challenge_chains.name')"
        />
      </div>
      <div class="input_field_wrapper">
        <div
          v-if="description"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("challenges.challenge_chains.description") }}
        </div>
        <textarea
          class="name_input general-contrast-color"
          v-model="description"
          :placeholder="$t('challenges.challenge_chains.description')"
        >
        </textarea>
      </div>
      <button
        @click="openChallengesAddition"
        class="add_challenges brand-secondary-bg general-brand-color"
      >
        {{
          $t("challenges.challenge_chains.add_challenges") +
          selectedChallengesCountString
        }}
      </button>
      <button
        v-if="isAnyChallengeSelected"
        @click="openChallengesDistribution"
        class="add_challenges general-brand-bg general-white-color"
      >
        {{ $t("challenges.challenge_chains.configure_steps") }}
      </button>
      <div class="input_field_wrapper">
        <div
          v-if="dateRangeStart"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("challenges.challenge_chains.chain_start_date") }}
        </div>
        <Datepicker
          v-model="dateRangeStart"
          text-input
          auto-apply
          format="dd.MM.yyyy"
          :clearable="true"
          :placeholder="$t('challenges.challenge_chains.chain_start_date')"
          :enable-time-picker="false"
        >
          <template #clear-icon="{ clear }">
            <CloseIcon @click="clear" />
          </template>
        </Datepicker>
      </div>
      <div class="input_field_wrapper">
        <div
          v-if="dateRangeEnd"
          class="input_field_placeholder general-secondary-color general-white-bg"
        >
          {{ $t("challenges.challenge_chains.chain_end_date") }}
        </div>
        <Datepicker
          v-model="dateRangeEnd"
          text-input
          auto-apply
          format="dd.MM.yyyy"
          :clearable="true"
          :placeholder="$t('challenges.challenge_chains.chain_end_date')"
          :enable-time-picker="false"
        >
          <template #clear-icon="{ clear }">
            <CloseIcon @click="clear" />
          </template>
        </Datepicker>
      </div>
      <CreateChainPhotoSelect @imagesRefreshed="imagesRefreshed" />
      <div class="action_buttons">
        <button
          @click="createChallengeChain"
          class="action_button general-brand-bg general-white-color"
        >
          {{ $t("challenges.challenge_chains.create") }}
        </button>
        <button
          class="action_button brand-secondary-bg general-brand-color"
          @click="closeChallengeChainCreation"
        >
          {{ $t("challenges.challenge_chains.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import Datepicker from "@vuepic/vue-datepicker";
import CreateChainPhotoSelect from "./CreateChainPhotoSelect.vue";
import { notify } from "@/general-scripts/toast-notification";
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { useStore as useProfileStore } from "@/store/profile";
import ChallengesAddition from "./ChallengesAddition.vue";
import ChallengesDistribution from "./ChallengesDistribution.vue";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "CreateChallengeChain",
  components: {
    Datepicker,
    CreateChainPhotoSelect,
    ChallengesAddition,
    ChallengesDistribution,
    CloseIcon,
  },
  data() {
    return {
      name: "",
      description: "",
      dateRangeStart: null,
      dateRangeEnd: null,
      challengesAdditionOpened: false,
      challengesDistributionOpened: false,
      selectedChallengesList: [],
      chainSteps: [],
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    selectedChallengesCountString() {
      let selectedChallengesCount = 0;
      for (let i = 0; i < this.selectedChallengesList.length; ++i) {
        if (this.selectedChallengesList[i].selected) {
          selectedChallengesCount++;
        }
      }
      if (selectedChallengesCount > 0) {
        return " (" + selectedChallengesCount + ")";
      } else {
        return "";
      }
    },
    challengeGroupsAPI() {
      return API_URIS.challengeGroups.replace(
        "organization_id",
        this.profileInfo?.profile.organization_id
      );
    },
    isAnyChallengeSelected() {
      for (let i = 0; i < this.selectedChallengesList.length; ++i) {
        if (this.selectedChallengesList[i].selected) return true;
      }
      return false;
    },
  },
  methods: {
    initializeSteps() {
      this.chainSteps = [
        {
          title: this.$t("challenges.challenge_chains.step") + " 1",
          items: [],
        },
      ];
      for (let i = 0; i < this.selectedChallengesList.length; ++i) {
        if (this.selectedChallengesList[i].selected) {
          this.chainSteps[0].items.push(this.selectedChallengesList[i]);
        }
      }
    },
    saveConfiguredChallenges(newChainSteps) {
      this.chainSteps = newChainSteps;
      this.challengesDistributionOpened = false;
    },
    saveChosenChallenges(newChallengesList) {
      this.selectedChallengesList = newChallengesList;
      this.challengesAdditionOpened = false;
      this.initializeSteps();
    },
    cancelChosenChallenges() {
      this.challengesAdditionOpened = false;
    },
    openChallengesAddition() {
      this.challengesAdditionOpened = true;
    },
    closeChallengeChainCreation() {
      this.$emit("chainCreationCancelled");
    },
    openChallengesDistribution() {
      this.challengesDistributionOpened = true;
    },
    closeChallengesDistribution() {
      this.challengesDistributionOpened = false;
    },
    imagesRefreshed(photos) {
      this.photos = photos;
    },
    async createChallengeChain() {
      try {
        let requestObject = new FormData();
        requestObject.append("name", this.name);
        requestObject.append("description", this.description);

        let curTimezone = -new Date().getTimezoneOffset() / 60;
        let absoluteOffset = Math.floor(Math.abs(curTimezone));
        let sign = curTimezone < 0 ? "-" : "+";
        curTimezone =
          absoluteOffset < 10 ? "0" + absoluteOffset : absoluteOffset;
        curTimezone = sign + curTimezone + ":00";

        if (this.dateRangeStart) {
          let chainStartDate = this.dateRangeStart;
          if (typeof this.dateRangeStart !== "string") {
            chainStartDate = this.dateRangeStart.toISOString();
          }
          chainStartDate = chainStartDate.split("T")[0];
          requestObject.append(
            "start_at",
            chainStartDate /*+ "T00:00:00" + curTimezone*/
          );
        }
        if (this.dateRangeEnd) {
          let chainEndDate = this.dateRangeEnd;
          if (typeof this.dateRangeEnd !== "string") {
            chainEndDate = this.dateRangeEnd.toISOString();
          }
          chainEndDate = chainEndDate.split("T")[0];
          requestObject.append(
            "end_at",
            chainEndDate /*+ "T23:59:59" + curTimezone*/
          );
        }
        for (let i = 0; i < this.photos?.length; i++) {
          requestObject.append("photos", this.photos[i]);
        }

        let stepsToSend = [];
        for (let i = 0; i < this.chainSteps.length; ++i) {
          for (let j = 0; j < this.chainSteps[i].items.length; ++j) {
            stepsToSend.push({
              id: this.chainSteps[i].items[j].id,
              step: i + 1,
              step_sort: j + 1,
            });
          }
        }
        if (stepsToSend.length) {
          requestObject.append("steps", JSON.stringify(stepsToSend));
        }
        await axios.post(this.challengeGroupsAPI, requestObject);
        notify(this.$t("challenges.challenge_chains.chain_created"), "success");
        this.$emit("challengeChainCreated");
      } catch (err) {
        notify(
          err?.response?.data?.errors ||
            err?.response?.data ||
            err?.message ||
            this.$t("notification.error")
        );
      }
    },
  },
};
</script>

<style scoped>
.create_challenge_chain_wrapper {
  position: fixed;
  z-index: 5000;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: auto;
  display: flex;
}

.create_challenge_chain {
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

.input_field_wrapper {
  position: relative;
  width: 100%;
}
.input_field_placeholder {
  z-index: 3;
  position: absolute;
  padding: 0px 5px;
  top: -9px;
  left: 15px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.chain_name_wrapper {
  position: relative;
}
.name_input_placeholder {
  position: absolute;
  z-index: 10;
  top: -5px;
  left: 15px;
  font-family: "SF Pro Text";
  font-size: 10px;
  font-weight: 400;
  line-height: 10px;
  text-align: left;
}
.name_input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--generalColorGrey);
  padding: 16px;
  border-radius: 12px;
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
}

.add_challenges {
  border-radius: 12px;
  padding: 16px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  text-align: center;
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>
<style >
.dp__input_wrap > svg {
  display: none;
}
.dp__input_wrap > input::placeholder {
  color: var(--generalContrast) !important;
  font-size: 14px;
}
.dp__input {
  padding: 12px !important;
  border-radius: 12px !important;
  font-size: 14px !important;
  background-color: var(--generalColorWhite) !important;
}
</style>
