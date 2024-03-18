<template>
  <div class="challenge_update_card">
    <div class="challenge_update_card_title_wrapper">
      <h3 class="challenge_update_card_title">
        {{ $t("challenges.challenge_update.title") }}
      </h3>
      <h5 class="challenge_update_card_description">
        {{ $t("challenges.challenge_update.description") }}
      </h5>
    </div>
    <div class="challenge_update_card_form">
      <div class="challenge_name_input_wrapper">
        <span
          class="challenge_name_input_placeholder"
          v-if="formData.challengeName"
        >
          {{ $t("challenges.challenge_update.challenge_name") }}
        </span>
        <input
          class="challenge_name_input"
          type="text"
          maxlength="255"
          :placeholder="$t('challenges.challenge_update.challenge_name')"
          v-model="formData.challengeName"
        />
      </div>
      <div class="challenge_name_input_wrapper">
        <span
          class="challenge_name_input_placeholder"
          v-if="formData.challengeDescription"
        >
          {{ $t("challenges.challenge_update.challenge_description") }}
        </span>
        <textarea
          v-model="formData.challengeDescription"
          class="challenge_description_input"
          :placeholder="$t('challenges.challenge_update.challenge_description')"
        />
      </div>
      <div
        class="datepicker_wrapper"
        v-if="allowFields.challengeEndDate && showEndDate"
      >
        <span
          class="challenge_name_input_placeholder"
          v-if="formData.challengeEndDate"
        >
          {{ $t("challenges.challenge_update.challenge_end_date") }}
        </span>
        <Datepicker
          v-model="formData.challengeEndDate"
          class="challenge_date_picker"
          text-input
          auto-apply
          format="dd.MM.yyyy"
          locale="ru"
          position="left"
          :clearable="true"
          :placeholder="$t('challenges.challenge_update.challenge_end_date')"
          :enable-time-picker="false"
        >
          <template #clear-icon="{ clear }">
            <CloseIcon @click="clear" />
          </template>
        </Datepicker>
      </div>
      <div
        class="challenge_name_input_wrapper"
        v-if="allowFields.challengePriseFund"
      >
        <span
          class="challenge_name_input_placeholder"
          v-if="formData.challengePriseFund"
        >
          {{ $t("challenges.challenge_update.challenge_prise_fund") }}
        </span>
        <input
          class="challenge_name_input"
          type="text"
          :placeholder="$t('challenges.challenge_update.challenge_prise_fund')"
          v-model="formData.challengePriseFund"
        />
      </div>
      <div
        class="challenge_name_input_wrapper"
        v-if="allowFields.challengePrisePlaces"
      >
        <span
          class="challenge_name_input_placeholder"
          v-if="formData.challengePrisePlaces"
        >
          {{ $t("challenges.challenge_update.challenge_prise_places") }}
        </span>
        <input
          class="challenge_name_input"
          type="text"
          :placeholder="
            $t('challenges.challenge_update.challenge_prise_places')
          "
          v-model="formData.challengePrisePlaces"
        />
      </div>

      <button
        v-if="isAllFields"
        class="challenge_chain brand-secondary-bg general-brand-color"
        @click="goToGroupsLinking"
      >
        {{
          $t("challenges.challenge_chains.challenge_chain") +
          selectedGroupsCount
        }}
      </button>

      <button
        v-if="isAllFields && selectedGroupsCount"
        class="dependencies general-brand-bg general-white-color"
        @click="goToDependenciesLinking"
      >
        {{
          $t("challenges.challenge_chains.dependencies") +
          selectedDependenciesCount
        }}
      </button>

      <div
        v-if="sponsorAccounts.length > 0 && allowFields.challengeSponsor"
        class="account_selection_enabler"
      >
        <input
          type="checkbox"
          class="checkbox"
          v-model="enableAccountSelection"
        />
        {{ $t("challenges.challenge_update.enable_account_selection") }}
      </div>
      <div
        v-if="enableAccountSelection"
        class="challenge_name_input_wrapper"
        v-show="sponsorAccounts.length > 0 && allowFields.challengeSponsor"
      >
        <span
          class="challenge_name_input_placeholder"
          v-if="formData.challengeSponsor"
        >
          {{ $t("challenges.challenge_settings.choose_challenge_sponsor") }}
        </span>
        <vSelect
          v-model="formData.challengeSponsor"
          :options="sponsorAccounts"
          :placeholder="
            $t('challenges.challenge_settings.choose_challenge_sponsor')
          "
          label="displayLabel"
          :clearable="false"
        />
      </div>

      <ChallengeCoverLoader
        ref="coverLoader"
        :buttonText="$t('challenges.create_challenge.challenge_covers')"
        :photos="challengeData.photo || challengeData.photos"
        @fileListSort="fileListSortChanged"
        @fileListForSend="fileListForSendChanged"
        @coverImageChanged="coverImageChanged"
        @imageCropped="updateChallenge"
      />

      <div class="form_checkbox" v-if="allowFields.challengeMultipleReports">
        <span>
          {{
            $t(
              "challenges.challenge_update.challenge_additional_settings_multiple_reports"
            )
          }}
        </span>
        <label class="switch">
          <input type="checkbox" v-model="formData.challengeMultipleReports" />
          <span class="slider round"></span>
        </label>
      </div>
      <div class="form_checkbox" v-if="allowFields.challengeShowEmployees">
        <span>
          {{
            $t(
              "challenges.challenge_update.challenge_additional_settings_show_employees"
            )
          }}
        </span>
        <label class="switch">
          <input type="checkbox" v-model="formData.challengeShowEmployees" />
          <span class="slider round"></span>
        </label>
      </div>
      <div
        class="form_delayed_start"
        v-if="allowFields.challengeDelayedStart && showDellayedStart"
      >
        <input
          type="checkbox"
          class="checkbox"
          v-model="formData.challengeDelayedStart"
        />
        <label>
          <span class="form_delayed_start_text">
            {{
              $t(
                "challenges.challenge_update.challenge_additional_settings_delayed_start"
              )
            }}
          </span>
        </label>
      </div>
      <div
        class="datepicker_wrapper"
        v-show="
          formData.challengeDelayedStart &&
          allowFields.challengeDelayedStart &&
          showDellayedStart
        "
      >
        <span
          class="challenge_name_input_placeholder"
          v-if="formData.challengeStartDate"
        >
          {{ $t("challenges.challenge_update.challenge_start_date") }}
        </span>
        <Datepicker
          v-model="formData.challengeStartDate"
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
      <div
        class="challenge_name_input_wrapper"
        v-if="allowFields.challengeType"
      >
        <span
          class="challenge_name_input_placeholder"
          v-if="formData.challengeType"
        >
          {{ $t("challenges.challenge_settings.choose_challenge_type") }}
        </span>
        <vSelect
          v-model="formData.challengeType"
          :options="createChallengeStore.challengeTypes"
          :placeholder="
            $t('challenges.challenge_settings.choose_challenge_type')
          "
          label="name"
          :clearable="false"
        />
      </div>
    </div>
    <div class="challenge_update_card_buttons">
      <button class="challenge_button _save" @click="checkCover">
        {{ $t("challenges.challenge_update.challenge_save") }}
      </button>
      <button class="challenge_button _cancel" @click="cancel">
        {{ $t("challenges.challenge_update.challenge_cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS, SERVER_IP } from "@/constants/api";

import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";

import { CHALLENGE_CONDITIONS } from "@/infrastructure/constants/challenge-conditions";
import Datepicker from "@vuepic/vue-datepicker";
import vSelect from "vue-select";
import CloseIcon from "@/components/Icons/close.vue";

import ChallengeCoverLoader from "@/components/ChallengeItemElements/ChallengeCoverLoader.vue";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "ChallengeUpdateCard",
  components: {
    Datepicker,
    ChallengeCoverLoader,
    vSelect,
    CloseIcon,
  },
  props: {
    challengeData: {
      required: true,
    },
    challengeGroupsList: {
      required: true,
      default: [],
    },
    challengesList: {
      required: true,
      default: [],
    },
    chainSteps: {
      default: [],
    },
  },
  data() {
    return {
      sponsorAccounts: [],
      formData: {
        challengeName: "", //name
        challengeDescription: "", //description
        challengeEndDate: null, //end_at
        challengePriseFund: null, // start_valance
        challengePrisePlaces: null, //winners_count
        challengeSponsor: null, //acount_id
        challengeMultipleReports: false, //multiple_reports
        challengeShowEmployees: false, //show_contenders
        challengeDelayedStart: false,
        // challengeCover: null,
        challengeStartDate: null, //start_at
        challengeType: null, //challenge_type
      },
      allowFields: {
        challengeName: false,
        challengeDescription: false,
        challengeEndDate: false,
        challengePriseFund: false,
        challengePrisePlaces: false,
        challengeSponsor: false,
        challengeMultipleReports: false,
        challengeShowEmployees: false,
        challengeDelayedStart: false,
        challengeStartDate: false,
        challengeType: false,
      },
      dataLoaded: false,

      enableAccountSelection: false,

      fileList: null,
      photos: null,
      coverChanged: false,
    };
  },
  watch: {
    "formData.challengeName": {
      handler(newVal) {
        this.$emit("challengeNameChanged", newVal);
      },
      flush: "post",
    },
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
    selectedDependenciesCount() {
      let selectedCount = this.challengesList.length;
      if (selectedCount) {
        return ` (${selectedCount})`;
      }
      return "";
    },
    selectedGroupsCount() {
      let selectedCount = 0;
      for (let i = 0; i < this.challengeGroupsList?.length; ++i) {
        let curGroup = this.challengeGroupsList[i];
        if (curGroup.selected) {
          selectedCount++;
        }
      }
      if (selectedCount) {
        return ` (${selectedCount})`;
      }
      return "";
    },
    showEndDate() {
      if (
        this.challengeData.challenge_condition ==
        CHALLENGE_CONDITIONS.waitToStart
      ) {
        return true;
      } else {
        return true;
      }
    },
    showDellayedStart() {
      if (
        this.challengeData.challenge_condition ==
        CHALLENGE_CONDITIONS.waitToStart
      ) {
        return true;
      } else {
        return false;
      }
    },
    isAllFields() {
      if (
        this.challengeData.challenge_condition !==
          CHALLENGE_CONDITIONS.completed &&
        this.challengeData.winners_count == 0 &&
        this.challengeData.participants_total == 0
      ) {
        return true;
      } else if (
        this.challengeData.challenge_condition ==
        CHALLENGE_CONDITIONS.waitToStart
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    goToGroupsLinking() {
      this.$emit("goToGroupsLinking");
    },
    goToDependenciesLinking() {
      this.$emit("goToDependenciesLinking");
    },
    cancel() {
      this.$emit("cancel");
    },
    getChallengeType(challengeTypeId) {
      return this.createChallengeStore.challengeTypes.find(
        (el) => el.id === challengeTypeId
      );
    },
    setSponsor() {
      let personalAccounts =
        this.createChallengeStore?.challengeCreationSettings?.accounts
          ?.personal_accounts;
      let orgAccounts =
        this.createChallengeStore?.challengeCreationSettings?.accounts
          ?.organization_accounts;

      if (!personalAccounts || !orgAccounts) return [];

      personalAccounts.map((el) => {
        el.personal = true;
      });
      orgAccounts.map((el) => {
        el.personal = false;
      });

      let accounts = personalAccounts.concat(orgAccounts);
      accounts.map((el) => {
        let displayLabel = null;
        if (el.personal) {
          displayLabel = this.$t(
            "challenges.challenge_settings.personal_account"
          );
        } else {
          displayLabel = this.$t(
            "challenges.challenge_settings.organization_account"
          );
        }
        displayLabel += " (" + el.organization_name + ")";
        displayLabel +=
          ", " +
          this.$t("challenges.challenge_settings.balance") +
          ": " +
          el.amount;
        el.displayLabel = displayLabel;
      });
      this.sponsorAccounts = accounts;
    },
    setSponsorForInput() {
      if (this.challengeData.from_organization) {
        this.formData.challengeSponsor = this.sponsorAccounts.find(
          (el) => el.personal !== true
        );
      } else {
        this.formData.challengeSponsor = this.sponsorAccounts.find(
          (el) => el.personal == true
        );
      }
    },
    setAllowFields() {
      if (this.isAllFields) {
        this.allowFields.challengeName = true;
        this.allowFields.challengeDescription = true;
        this.allowFields.challengeEndDate = true;
        this.allowFields.challengePriseFund = true;
        this.allowFields.challengePrisePlaces = true;
        this.allowFields.challengeSponsor = true;
        this.allowFields.challengeMultipleReports = true;
        this.allowFields.challengeShowEmployees = true;
        this.allowFields.challengeDelayedStart = true;
        this.allowFields.challengeStartDate = true;
        this.allowFields.challengeType = true;
      } else {
        this.allowFields.challengeName = true;
        this.allowFields.challengeDescription = true;
      }
    },
    setFormData() {
      this.formData.challengeName = this.challengeData.name;
      this.formData.challengeDescription = this.challengeData.description;
      this.formData.challengeEndDate = this.challengeData.end_at;
      this.formData.challengePriseFund = this.challengeData.fund;
      this.formData.challengePrisePlaces = this.challengeData.awardees;
      this.setSponsorForInput();
      this.formData.challengeMultipleReports =
        this.challengeData.multiple_reports;
      this.formData.challengeShowEmployees = this.challengeData.show_contenders;
      this.formData.challengeDelayedStart =
        this.challengeData.challenge_condition ==
        CHALLENGE_CONDITIONS.waitToStart
          ? true
          : false;
      this.formData.challengeStartDate = this.challengeData.start_at;
      this.formData.challengeType = this.getChallengeType(
        this.challengeData.algorithm_type
      );
    },
    fileListSortChanged(list) {
      this.fileList = list;
    },
    fileListForSendChanged(list) {
      this.photos = list;
    },
    dateToString(date) {
      let newDate = new Date(date);
      return newDate.toISOString();
    },
    coverImageChanged() {
      this.coverChanged = true;
    },
    imageCropped() {
      this.updateChallenge(file);
    },
    checkCover() {
      if (this.coverChanged && this.fileList.length) {
        this.$refs.coverLoader.openCropper();
      } else {
        this.updateChallenge();
      }
    },
    async updateChallenge(file) {
      let challengeSettings = new FormData();
      if (this.isAllFields) {
        challengeSettings.append("name", this.formData.challengeName);
        challengeSettings.append(
          "description",
          this.formData.challengeDescription
        );
        challengeSettings.append(
          "end_at",
          this.dateToString(this.formData.challengeEndDate)
        );
        challengeSettings.append(
          "start_balance",
          this.formData.challengePriseFund
        );
        challengeSettings.append(
          "winners_count",
          this.formData.challengePrisePlaces
        );
        if (this.enableAccountSelection) {
          challengeSettings.append(
            "account_id",
            this.formData.challengeSponsor.id
          );
        }
        challengeSettings.append(
          "multiple_reports",
          this.formData.challengeMultipleReports
        );
        challengeSettings.append(
          "show_contenders",
          this.formData.challengeShowEmployees
        );
        challengeSettings.append(
          "challenge_type",
          this.formData.challengeType.type
        );
        challengeSettings.append("fileList", JSON.stringify(this.fileList));
        for (let i = 0; i < this.photos.length; i++) {
          challengeSettings.append("photos", this.photos[i]);
        }
        if (file) {
          challengeSettings.append("cropped_photo", file);
        }
        if (
          this.formData.challengeStartDate &&
          this.showDellayedStart &&
          this.formData.challengeDelayedStart
        ) {
          challengeSettings.append(
            "start_at",
            this.dateToString(this.formData.challengeStartDate)
          );
        } else {
          challengeSettings.append("start_at", "");
        }

        let groupIDs = [];
        for (let i = 0; i < this.challengeGroupsList?.length; ++i) {
          let curGroup = this.challengeGroupsList[i];
          if (curGroup.selected) {
            groupIDs.push(curGroup.id);
          }
        }
        challengeSettings.append("groups", JSON.stringify(groupIDs));

        if (!groupIDs?.length) {
          challengeSettings.append("dependencies", "[]");
        }

        let challengeStep = 0;
        for (let i = 0; i < this.chainSteps.length; ++i) {
          for (let j = 0; j < this.chainSteps[i].items.length; ++j) {
            if (this.chainSteps[i].items[j].id === this.challengeData.id) {
              challengeStep = i + 1;
              break;
            }
          }
          if (challengeStep > 0) break;
        }
        if (challengeStep > 0) challengeSettings.append("step", challengeStep);

        // let dependencyIDs = [];
        // for (let i = 0; i < this.challengesList?.length; ++i) {
        //   let curDependency = this.challengesList[i];
        //   dependencyIDs.push(curDependency.dependency_id);
        // }
        // challengeSettings.append("dependencies", JSON.stringify(dependencyIDs));
      } else if (!this.isAllFields) {
        challengeSettings.append("name", this.formData.challengeName);
        challengeSettings.append(
          "description",
          this.formData.challengeDescription
        );
        challengeSettings.append("fileList", JSON.stringify(this.fileList));
        for (let i = 0; i < this.photos.length; i++) {
          challengeSettings.append("photos", this.photos[i]);
        }
      }
      try {
        let response = await axios.patch(
          `${API_URIS.challengesUpdate}${this.challengeData.id}/`,
          challengeSettings
        );
        if (
          response.status == "200" ||
          response.status == "201" ||
          response.status == "202" ||
          response.status == "204"
        ) {
          this.$moshaToast(
            {
              title: this.$t("challenges.challenge_update.challenge_updated"),
            },
            {
              position: "bottom-right",
              timeout: 3000,
              transition: "slide",
              type: "success",
            }
          );
        }

        this.$emit("challengeUpdated");
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
        } else if (err?.response?.data?.errors) {
          notify(err?.response?.data?.errors);
        } else {
          notify(
            err?.response?.data || err?.message || this.$t("notification.error")
          );
        }
        throw err;
        // this.$moshaToast(
        //   {
        //     title: this.$t(
        //       "challenges.challenge_update.challenge_updation_error"
        //     ),
        //   },
        //   {
        //     position: "bottom-right",
        //     timeout: 3000,
        //     transition: "slide",
        //     type: "danger",
        //   }
        // );
        // this.$emit("challengeUpdationError");
        // throw error;
      }
    },
  },
  mounted() {
    this.createChallengeStore.getSponsors().then(() => {
      this.setSponsor();
    });
    this.setAllowFields();
    setTimeout(() => {
      this.setFormData();
    }, 500);
  },
};
</script>

<style scoped>
.challenge_update_card {
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
.challenge_name_input {
  width: 100%;
  height: 48px;
  outline: none;
  border: 1px solid var(--generalColorGrey);
  background-color: var(--generalColorWhite);
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
}
.challenge_name_input_placeholder {
  position: absolute;
  top: -7px;
  left: 18px;
  padding: 0 5px;
  background-color: var(--generalColorWhite);
  color: var(--generalColorSecondary);
  font-size: 15px;
  z-index: 10;
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
  background-color: var(--generalColorWhite);
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
}
.challenge_description_input::placeholder {
  color: var(--generalColorSecondary) !important;
  opacity: 0.8;
  font-size: 15px;
  font-weight: 100;
  letter-spacing: 0.5px;
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
.account_selection_enabler {
  display: flex;
  align-items: center;
  gap: 10px;
}
.datepicker_wrapper {
  width: 100%;
  position: relative;
}
.dp__input {
  border-radius: 10px !important;
}
.input-slot-image {
  width: 24px;
  margin: 6px 6px 0 0;
}

.form_checkbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.form_delayed_start {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}
.form_winners_choice {
  width: 100%;
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