<template>
  <div class="create_chain_from_template_wrapper">
    <div class="create_chain_from_template" v-show="currentStep == 0">
      <ChallengesAddition
        v-if="challengesAdditionOpened"
        :selectedChallengesList="selectedChallengesList"
        :isChain="true"
        :isUpdating="true"
        :currentChainID="chainTemplate.id"
        @cancelChosenChallenges="cancelChosenChallenges"
        @saveChosenChallenges="saveChosenChallenges"
      />
      <ChallengesDistribution
        v-if="challengesDistributionOpened"
        :chainSteps="chainSteps"
        @saveConfiguredChallenges="saveConfiguredChallenges"
        @cancelConfiguredChallenges="closeChallengesDistribution"
      />
      <div class="form_header">
        <h1 class="header_title">
          {{ $t("challenges.challenge_chains.main_info") }}
        </h1>
        <h3 class="header_description">
          {{
            $t("challenges.challenge_chains.fill_data_about_challenge_chains")
          }}
        </h3>
      </div>
      <div class="form_inputs">
        <input
          type="text"
          class="_input chain_name"
          :placeholder="$t('challenges.challenge_chains.name')"
          v-model="chainData.name"
        />
        <textarea
          class="_input chain_description"
          :placeholder="$t('challenges.challenge_chains.description')"
          v-model="chainData.description"
        />
        <button class="add_challenges" @click="openChallengesAddition">
          {{
            $t("challenges.challenge_chains.add_challenges") +
            selectedChallengesCountString
          }}
        </button>
        <button
          v-if="isAnyChallengeSelected"
          @click="openChallengesDistribution"
          class="add_steps"
        >
          {{ $t("challenges.challenge_chains.configure_steps") }}
        </button>
        <div class="dellayed_start">
          <input type="checkbox" class="checkbox" v-model="delayedStart" />
          <h4 class="dellayed_start_title">
            {{ $t("challenges.create_challenge.deferred_creation") }}
          </h4>
        </div>
        <Datepicker
          v-if="delayedStart"
          v-model="chainData.startDate"
          class="chain_date_picker"
          text-input
          auto-apply
          format="dd.MM.yyyy"
          locale="ru"
          position="left"
          :min-date="periodStartDate"
          :max-date="periodEndDate"
          :clearable="true"
          :placeholder="$t('challenges.challenge_chains.chain_start_date')"
          :enable-time-picker="false"
        >
          <template #clear-icon="{ clear }">
            <CloseIcon @click="clear" />
          </template>
        </Datepicker>
        <Datepicker
          v-model="chainData.endDate"
          class="chain_date_picker"
          text-input
          auto-apply
          format="dd.MM.yyyy"
          locale="ru"
          position="left"
          :min-date="periodStartDate"
          :max-date="periodEndDate"
          :clearable="true"
          :placeholder="$t('challenges.challenge_chains.chain_end_date')"
          :enable-time-picker="false"
        >
          <template #clear-icon="{ clear }">
            <CloseIcon @click="clear" />
          </template>
        </Datepicker>
        <ChallengeCoverLoader
          ref="coverLoader"
          :buttonText="$t('challenges.challenge_chains.chain_covers')"
          :photos="chainTemplate?.photos"
          :templatePhotos="chainTemplate.photos"
          @fileListSort="fileListSortChanged"
          @fileListForSend="fileListForSendChanged"
          @coverImageChanged="coverImageChanged"
          @imageCropped="setCrooped"
        />
      </div>
      <div class="form_control">
        <button class="_continue" @click="checkCover">
          {{ $t("challenges.create_challenge.continue") }}
        </button>
        <button class="_cancel" @click="cancelCreation">
          {{ $t("challenges.create_challenge.cancel") }}
        </button>
      </div>
    </div>
    <CreateChainChallengeFromTemplate
      v-show="currentStep > 0"
      :currentStep="currentStep"
      :totalSteps="creationSteps"
      :chainId="this.chainTemplate.id"
      :selectedChallengesList="selectedChallengesList"
      @nextStep="nextStep"
      @prevStep="prevStep"
      @createChain="createChain"
    />
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { mapStores } from "pinia";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import { useStore as useChainCreationFromTemplateStore } from "@/store/ChainCreationFromTemplateStore/index";
import { useStore as useProfileStore } from "@/store/profile";
import { organizationSettingsStore } from "@/store/organization-settings";

import ChallengesAddition from "@/components/ChallengeChainsElements/ChallengesAddition.vue";
import ChallengesDistribution from "@/components/ChallengeChainsElements/ChallengesDistribution.vue";
import Datepicker from "@vuepic/vue-datepicker";
import ChallengeCoverLoader from "@/components/ChallengeItemElements/ChallengeCoverLoader.vue";
import CreateChainChallengeFromTemplate from "./ChallengeForm.vue";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "CreateChainFromTemplate",
  components: {
    ChallengesAddition,
    ChallengesDistribution,
    Datepicker,
    ChallengeCoverLoader,
    CreateChainChallengeFromTemplate,
    CloseIcon,
  },
  props: {
    chainTemplate: {
      required: true,
    },
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),

      challengesAdditionOpened: false,
      challengesDistributionOpened: false,

      selectedChallengesList: [],
      chainSteps: [],

      chainData: {
        name: "",
        description: "",
        startDate: null,
        endDate: null,
      },

      delayedStart: false,

      fileList: null,
      photos: null,
      coverChanged: false,
      croppedCover: null,

      currentStep: 0,
    };
  },
  computed: {
    ...mapStores(useChallengeTemplatesStore),
    ...mapStores(useChainCreationFromTemplateStore),
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
    creationSteps() {
      return this.selectedChallengesList.length;
    },
    periodStartDate() {
      return new Date(this.organizationSettings.periodStartDate);
    },
    periodEndDate() {
      return new Date(this.organizationSettings.periodEndDate);
    },
  },
  methods: {
    fillInputs() {
      this.chainData.name = this.chainTemplate.name;
      this.chainData.description = this.chainTemplate.description;
    },
    openChallengesAddition() {
      this.challengesAdditionOpened = true;
    },
    cancelChosenChallenges() {
      this.challengesAdditionOpened = false;
    },
    saveChosenChallenges(newChallengesList) {
      this.selectedChallengesList = newChallengesList.reverse();
      this.challengesAdditionOpened = false;
      this.initializeSteps();
    },
    findSelectedByStep(items, step) {
      let challengeList = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].selected && items[i].step === step) {
          challengeList.push(items[i]);
        }
      }
      return challengeList;
    },
    initializeSteps() {
      let stepCount = 1;
      for (let i = 0; i < this.selectedChallengesList.length; i++) {
        stepCount = Math.max(this.selectedChallengesList[i].step, stepCount);
      }
      let newChainSteps = [];

      for (let i = 0; i < stepCount; i++) {
        newChainSteps.push({
          title: this.$t("challenges.challenge_chains.step") + ` ${i + 1}`,
          items: this.findSelectedByStep(this.selectedChallengesList, i + 1),
        });
      }
      this.chainSteps = newChainSteps;
      setTimeout(() => {
        if (this.selectedChallengesList.find((el) => el.step == 0)) {
          let newAddedSteps = this.selectedChallengesList.filter(
            (el) => el.step == 0
          );
          for (let i = 0; i < newAddedSteps.length; i++) {
            newChainSteps[0].items.push(newAddedSteps[i]);
          }
        }
        this.chainSteps = newChainSteps.filter((el) => el.items !== 0);
      }, 100);
    },
    async getChallengeChainPinnedTemplates() {
      try {
        let params = {
          offset: 1,
          limit: 10000,
          scope:
            this.challengeTemplatesStore.selectedCategoryNavigationTab.scope,
          chain: this.chainTemplate.id,
        };
        const response = await axios.get(API_URIS.getChallengesTemplates, {
          params,
        });
        let selectedData = response.data;
        for (let i = 0; i < response.data.length; i++) {
          selectedData[i].selected = true;
        }
        this.saveChosenChallenges(selectedData);
      } catch (err) {
        throw err;
      }
    },
    openChallengesDistribution() {
      this.challengesDistributionOpened = true;
    },
    closeChallengesDistribution() {
      this.challengesDistributionOpened = false;
    },
    saveConfiguredChallenges(newChainSteps) {
      this.chainSteps = newChainSteps;
      this.challengesDistributionOpened = false;
    },
    fileListSortChanged(list) {
      this.fileList = list;
    },
    fileListForSendChanged(list) {
      this.photos = list;
    },
    coverImageChanged() {
      this.coverChanged = true;
    },
    cancelCreation() {
      this.$emit("closeChainCreation");
    },
    checkCover() {
      if (
        this.coverChanged &&
        this.fileList.length &&
        this.isAnyChallengeSelected
      ) {
        this.$refs.coverLoader.openCropper();
      } else {
        if (this.isAnyChallengeSelected) {
          this.nextStep();
        } else {
          this.$moshaToast(
            {
              title: this.$t(
                "challenges.challenge_chains.chain_not_include_challenges"
              ),
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "danger",
            }
          );
        }
      }
    },
    setCrooped(file) {
      (this.croppedCover = file),
        setTimeout(() => {
          if (this.isAnyChallengeSelected) {
            this.nextStep();
          } else {
            this.$moshaToast(
              {
                title: this.$t(
                  "challenges.challenge_chains.chain_not_include_challenges"
                ),
              },
              {
                position: "bottom-right",
                timeout: 3000,
                transition: "slide",
                type: "danger",
              }
            );
          }
        }, 100);
    },
    nextStep() {
      if (this.currentStep !== this.creationSteps) {
        this.currentStep += 1;
      }
    },
    prevStep() {
      this.currentStep -= 1;
    },

    setChainSteps() {
      let stepsToSend = [];
      for (let i = 0; i < this.chainSteps.length; i++) {
        for (let j = 0; j < this.chainSteps[i].items.length; j++) {
          stepsToSend.push({
            id: this.chainSteps[i].items[j].id,
            step: i + 1,
            step_sort: j + 1,
          });
        }
      }
      return stepsToSend;
    },
    setDate(date) {
      let curTimezone = -new Date().getTimezoneOffset() / 60;
      let absoluteOffset = Math.floor(Math.abs(curTimezone));
      let sign = curTimezone < 0 ? "-" : "+";
      curTimezone = absoluteOffset < 10 ? "0" + absoluteOffset : absoluteOffset;
      curTimezone = sign + curTimezone + ":00";

      let newDate = date;
      if (newDate) {
        if (typeof newDate !== "string") {
          newDate = newDate.toISOString();
        }
        newDate = newDate.split("T")[0];
        return newDate + "T00:00:00" + curTimezone;
      } else {
        return "";
      }
    },
    async createChain() {
      try {
        let chainData = new FormData();
        chainData.append("name", this.chainData.name);
        chainData.append("description", this.chainData.description);
        chainData.append("fileList", JSON.stringify(this.fileList));
        this.photos = this.photos.reverse();
        for (let i = 0; i < this.photos.length; i++) {
          chainData.append("photos", this.photos[i]);
        }
        if (this.croppedCover) {
          chainData.append("cropped_photo", this.croppedCover);
        }
        if (this.delayedStart) {
          chainData.append(
            "start_at",
            this.chainData.startDate.toISOString().slice(0, 10)
          );
        }
        chainData.append("end_at ", this.setDate(this.chainData.endDate));
        chainData.append("template_id", this.chainTemplate.id);
        chainData.append(
          "challenges",
          JSON.stringify(this.chainCreationFromTemplateStore.challengeList)
        );
        chainData.append(
          "organization_id",
          this.profileStore.profileInfo.profile.organization_id
        );

        let response = await axios.post(
          API_URIS.challengeGroups.replace(
            "organization_id",
            this.profileStore.profileInfo.profile.organization_id
          ),
          chainData
        );
        if (
          response.status == "200" ||
          response.status == "201" ||
          response.status == "202" ||
          response.status == "204"
        ) {
          this.$moshaToast(
            {
              title: this.$t("challenges.challenge_chains.chain_created"),
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "success",
            }
          );
          this.cancelCreation();
        }
      } catch (error) {
        this.$moshaToast(
          {
            title: this.$t("challenges.challenge_chains.chain_creation_error"),
          },
          {
            position: "bottom-right",
            timeout: 3000,
            transition: "slide",
            type: "danger",
          }
        );
        this.cancelCreation();
        throw error;
      }
    },
  },
  mounted() {
    this.getChallengeChainPinnedTemplates();
    this.fillInputs();
  },
};
</script>

<style scoped>
.create_chain_from_template_wrapper {
  width: 100%;
}
.create_chain_from_template {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.header_title {
  font-size: 20px;
  line-height: 23px;
  font-weight: 500;
  font-family: "Ubuntu";
  text-align: left;
  color: var(--generalContrast);
  margin: 0;
}
.header_description {
  font-size: 16px;
  line-height: 28px;
  font-weight: 400;
  font-family: "SF Pro Text";
  color: var(--generalColorSecondary);
  margin: 4px 0 0 0;
}
.form_inputs {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
._input {
  width: 100%;
  outline: none;
  resize: none;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  background-color: var(--generalColorWhite);
  box-sizing: border-box;
  padding: 16px;
  font-size: 14px;
  font-weight: 400;
  font-family: "SF Pro Text";
  color: var(--generalContrast);
}
._input::placeholder {
  color: var(--generalColorSecondary);
  font-size: 14px;
  font-weight: 400;
  font-family: "SF Pro Text";
}
.chain_name {
  height: 52px;
}
.chain_description {
  height: 166px;
}
.add_challenges {
  width: 100%;
  height: 56px;
  outline: none;
  border-radius: 12px;
  background-color: var(--secondaryColorBrand);
  font-size: 16px;
  font-family: "Roboto";
  color: var(--generalBrand);
}
.add_steps {
  width: 100%;
  height: 56px;
  outline: none;
  border-radius: 12px;
  background-color: var(--generalBrand);
  font-size: 16px;
  font-family: "Roboto";
  color: var(--secondaryColorBrand);
}
.dellayed_start {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}
.dellayed_start_title {
  font-size: 16px;
  font-weight: 400;
  font-family: "Ubuntu";
  color: var(--generalContrast);
  margin: 0;
}
.chain_date_picker {
  width: 100%;
}
::v-deep(.dp__input) {
  height: 52px !important;
  padding: 0 0 0 16px !important;
  background-color: var(--generalColorWhite);
  color: var(--generalContrast);
  font-size: 14px;
  font-weight: 400;
  font-family: "SF Pro Text";
  color: var(--generalContrast);
  border: 1px solid var(--generalColorGrey) !important;
  border-radius: 12px !important;
}
.input-slot-image {
  width: 24px;
  margin: 6px 6px 0 0;
}
.form_control {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 12px;
}
._continue {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--generalBrand);
  font-size: 16px;
  font-weight: 400;
  font-family: "Roboto";
  color: var(--secondaryColorBrand);
}
._cancel {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--secondaryColorBrand);
  font-size: 16px;
  font-weight: 400;
  font-family: "Roboto";
  color: var(--generalBrand);
}
</style>