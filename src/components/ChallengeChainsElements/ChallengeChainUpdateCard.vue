<template>
  <div class="challenge_chain_update_card">
    <div class="challenge_update_card_title_wrapper">
      <ChallengesAddition
        v-if="challengesAdditionOpened"
        @saveChosenChallenges="saveChosenChallenges"
        @cancelChosenChallenges="cancelChosenChallenges"
        :selectedChallengesList="selectedChallengesList"
        :currentChainID="chainData.id"
      />
      <ChallengesDistribution
        v-if="challengesDistributionOpened"
        :chainSteps="chainSteps"
        @saveConfiguredChallenges="saveConfiguredChallenges"
        @cancelConfiguredChallenges="closeChallengesDistribution"
      />
      <h3 class="challenge_update_card_title">
        {{ $t("challenges.challenge_chains.main_info") }}
      </h3>
      <h5 class="challenge_update_card_description">
        {{ $t("challenges.challenge_chains.fill_data_about_challenge_chains") }}
      </h5>
    </div>
    <div class="challenge_update_card_form">
      <div class="challenge_name_input_wrapper">
        <span class="challenge_name_input_placeholder" v-if="chainName">
          {{ $t("challenges.challenge_update.challenge_name") }}
        </span>
        <input
          class="challenge_name_input"
          maxlength="255"
          type="text"
          :placeholder="$t('challenges.challenge_update.challenge_name')"
          v-model="chainName"
        />
      </div>
      <div class="challenge_name_input_wrapper">
        <span class="challenge_name_input_placeholder" v-if="chainDescription">
          {{ $t("challenges.challenge_update.challenge_description") }}
        </span>
        <textarea
          v-model="chainDescription"
          class="challenge_description_input"
          :placeholder="$t('challenges.challenge_update.challenge_description')"
        />
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
      <div
        class="datepicker_wrapper"
        v-show="
          chainData?.current_state === 'D' || chainData?.contenders_total === 0
        "
      >
        <span class="challenge_name_input_placeholder" v-if="chainStartDate">
          {{ $t("challenges.challenge_chains.chain_start_date") }}
        </span>
        <Datepicker
          v-model="chainStartDate"
          class="challenge_date_picker"
          text-input
          auto-apply
          format="dd.MM.yyyy"
          locale="ru"
          position="left"
          :clearable="true"
          :placeholder="$t('challenges.challenge_update.challenge_start_date')"
          :enable-time-picker="false"
        >
          <template #clear-icon="{ clear }">
            <CloseIcon @click="clear" />
          </template>
        </Datepicker>
      </div>
      <div class="datepicker_wrapper">
        <span class="challenge_name_input_placeholder" v-if="chainEndDate">
          {{ $t("challenges.challenge_chains.chain_end_date") }}
        </span>
        <Datepicker
          v-model="chainEndDate"
          class="challenge_date_picker"
          text-input
          auto-apply
          format="dd.MM.yyyy"
          locale="ru"
          position="left"
          :clearable="true"
          :placeholder="$t('challenges.challenge_chains.chain_end_date')"
          :enable-time-picker="false"
        >
          <template #clear-icon="{ clear }">
            <CloseIcon @click="clear" />
          </template>
        </Datepicker>
      </div>
    </div>
    <ChallengeCoverLoader
      :buttonText="$t('challenges.challenge_chains.chain_covers')"
      :photos="chainData.photo || chainData.photos"
      @fileListSort="fileListSortChanged"
      @fileListForSend="fileListForSendChanged"
    />
    <div class="challenge_update_card_buttons">
      <button class="challenge_button _save" @click="updateChain">
        {{ $t("challenges.challenge_update.challenge_save") }}
      </button>
      <button class="challenge_button _cancel" @click="cancelChainUpdate">
        {{ $t("challenges.challenge_update.challenge_cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import ChallengeCoverLoader from "@/components/ChallengeItemElements/ChallengeCoverLoader.vue";
import { API_URIS } from "@/constants/api";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";
import axios from "axios";
import { notify } from "@/general-scripts/toast-notification";
import ChallengesAddition from "./ChallengesAddition.vue";
import ChallengesDistribution from "./ChallengesDistribution.vue";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "ChallengeChainUpdateCard",
  props: {
    chainData: {
      required: true,
    },
  },
  components: {
    ChallengeCoverLoader,
    Datepicker,
    ChallengesAddition,
    ChallengesDistribution,
    CloseIcon,
  },
  data() {
    return {
      chainName: "",
      chainDescription: "",
      chainStartDate: null,
      chainEndDate: null,
      fileList: null,
      photos: null,
      challengesAdditionOpened: false,
      challengesDistributionOpened: false,
      selectedChallengesList: [],
      chainSteps: [],
    };
  },
  mounted() {
    this.getChainChallenges();
  },
  watch: {
    chainData: {
      handler(newVal) {
        if (newVal) {
          this.chainName = newVal.name;
          this.chainDescription = newVal.description;
          if (
            this.chainData.curState === "D" ||
            this.chainData.contenders_total === 0
          )
            this.chainStartDate = newVal.start_at;
          this.chainEndDate = newVal.end_at;
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapStores(useProfileStore),
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
    isAnyChallengeSelected() {
      for (let i = 0; i < this.selectedChallengesList.length; ++i) {
        if (this.selectedChallengesList[i].selected) return true;
      }
      return false;
    },
  },
  methods: {
    initializeSteps() {
      this.chainSteps = [];
      let maxStep = 0;
      for (let i = 0; i < this.selectedChallengesList.length; ++i) {
        if (this.selectedChallengesList[i].step > maxStep) {
          maxStep = this.selectedChallengesList[i].step;
        }
      }
      if (maxStep === 0) maxStep++;
      for (let i = 0; i < maxStep; ++i) {
        this.chainSteps.push({
          title: this.$t("challenges.challenge_chains.step") + " " + (i + 1),
          items: [],
        });
      }
      for (let i = 0; i < this.selectedChallengesList.length; ++i) {
        if (this.selectedChallengesList[i].selected) {
          if (this.selectedChallengesList[i].step > 0) {
            this.chainSteps[this.selectedChallengesList[i].step - 1].items.push(
              this.selectedChallengesList[i]
            );
          } else {
            this.chainSteps[0].items.push(this.selectedChallengesList[i]);
          }
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
    openChallengesDistribution() {
      this.challengesDistributionOpened = true;
    },
    closeChallengesDistribution() {
      this.challengesDistributionOpened = false;
    },
    async getChainChallenges() {
      try {
        let params = {
          offset: 1,
          limit: 10000,
          group_id: this.chainData.id,
        };
        const response = await axios.get(API_URIS.challengesUpdate, {
          params,
        });
        this.selectedChallengesList = response.data.data;
        for (let i = 0; i < this.selectedChallengesList.length; ++i) {
          this.selectedChallengesList[i].selected = true;
        }
        this.initializeSteps();
      } catch (err) {
        throw err;
      }
    },
    async updateChain() {
      try {
        let requestObject = new FormData();
        requestObject.append("name", this.chainName);
        requestObject.append("description", this.chainDescription);
        if (this.chainStartDate) {
          let date = new Date(this.chainStartDate);
          requestObject.append("start_at", date.toISOString());
        }
        if (this.chainEndDate) {
          let date = new Date(this.chainEndDate);
          requestObject.append("end_at", date.toISOString());
        }
        requestObject.append("fileList", JSON.stringify(this.fileList));
        for (let i = 0; i < this.photos.length; i++) {
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
        await axios.patch(
          API_URIS.challengeGroups.replace(
            "organization_id",
            this.profileStore.profileInfo.profile.organization_id
          ) + this.$route.params.id,
          requestObject
        );
        notify(this.$t("challenges.challenge_chains.chain_updated"), "success");
        this.$emit("updateChain");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    cancelChainUpdate() {
      this.$emit("cancelChainUpdate");
    },
    fileListSortChanged(list) {
      this.fileList = list;
    },
    fileListForSendChanged(list) {
      this.photos = list;
    },
  },
};
</script>

<style scoped>
.challenge_chain_update_card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.challenge_update_card_title_wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.challenge_update_card_title {
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  font-family: "Ubuntu";
  color: var(--generalContrast);
  margin: 0;
}
.challenge_update_card_description {
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  font-family: "SF Pro Text";
  color: var(--generalColorSecondary);
  margin: 0;
}
.challenge_update_card_form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.challenge_name_input_wrapper {
  width: 100%;
  position: relative;
}
.input-slot-image {
  width: 24px;
  margin: 6px 6px 0 0;
}
.challenge_name_input {
  width: 100%;
  height: 48px;
  outline: none;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  background-color: var(--generalColorWhite);
}
.datepicker_wrapper {
  width: 100%;
  position: relative;
}
.challenge_name_input_placeholder {
  position: absolute;
  top: -7px;
  left: 18px;
  padding: 0 5px;
  background-color: #ffffff;
  color: var(--generalColorSecondary);
  font-size: 15px;
  z-index: 10;
  background-color: var(--generalColorWhite);
}
.challenge_name_input::placeholder {
  color: var(--generalColorSecondary);
  opacity: 0.8;
  font-size: 15px;
  font-weight: 100;
  letter-spacing: 0.5px;
}
.challenge_description_input {
  resize: none;
  width: 100%;
  height: 126px;
  outline: none;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  background-color: var(--generalColorWhite);
}
.challenge_description_input::placeholder {
  color: var(--generalColorSecondary) !important;
  opacity: 0.8;
  font-size: 15px;
  font-weight: 100;
  letter-spacing: 0.5px;
}
.add_challenges {
  width: 100%;
  border-radius: 12px;
  padding: 16px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
.challenge_update_card_buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}
.challenge_button {
  width: 50%;
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
</style>