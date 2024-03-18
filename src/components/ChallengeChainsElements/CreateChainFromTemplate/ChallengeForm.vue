<template>
  <div
    class="create_chain_challenge_from_template_wrapper"
    v-if="!!this.chainCreationFromTemplateStore.challengeList[currentStep - 1]"
  >
    <div
      class="form_header"
      v-if="createChallengeStore.selectedTab !== 'settings'"
    >
      <h1 class="header_title">
        <span>
          {{ $t("challenges.create_challenge.challenge_creation") }}
        </span>
        <span>
          {{ `${currentStep}/${totalSteps}` }}
        </span>
      </h1>
      <h3 class="header_description">
        {{ $t("challenges.create_challenge.fill_data") }}
      </h3>
    </div>
    <div
      class="form_inputs"
      v-if="createChallengeStore.selectedTab !== 'settings'"
    >
      <input
        type="text"
        class="_input chain_name"
        :placeholder="$t('challenges.challenge_chains.name')"
        v-model="challengeData.name"
      />
      <textarea
        class="_input chain_description"
        :placeholder="$t('challenges.challenge_chains.description')"
        v-model="challengeData.description"
      />
      <div class="dellayed_start">
        <input type="checkbox" class="checkbox" v-model="delayedStart" />
        <h4 class="dellayed_start_title">
          {{ $t("challenges.create_challenge.deferred_creation") }}
        </h4>
      </div>
      <Datepicker
        v-if="delayedStart"
        v-model="challengeData.start_at"
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
        v-model="challengeData.end_at"
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
      <input
        type="text"
        class="_input chain_name"
        :placeholder="$t('challenges.create_challenge.prize_fund')"
        v-model="challengeData.start_balance"
      />
      <input
        type="text"
        class="_input chain_name"
        :placeholder="$t('challenges.create_challenge.prize_places')"
        v-model="challengeData.parameter_value"
      />
      <vSelect
        v-model="challengeData.account_id"
        :options="sponsorList"
        :placeholder="
          $t('challenges.challenge_settings.choose_challenge_sponsor')
        "
        label="displayLabel"
      />
      <button
        class="_open_settings_button"
        @click="createChallengeStore.selectedTab = 'settings'"
      >
        {{ $t("challenges.create_challenge.additional_settings") }}
      </button>
    </div>
    <div
      class="form_control"
      v-if="createChallengeStore.selectedTab !== 'settings'"
    >
      <button v-if="isLastStep" class="_continue" @click="createChain">
        {{ $t("challenges.create_challenge.create") }}
      </button>
      <button v-else class="_continue" @click="nextStep">
        {{ $t("challenges.create_challenge.continue") }}
      </button>
      <button class="_cancel" @click="prevStep">
        {{ $t("challenges.create_challenge.back") }}
      </button>
    </div>
    <CreateChallengeSettings
      @click.stop
      :fromTemplate="true"
      v-if="createChallengeStore.selectedTab === 'settings'"
    />
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { mapStores } from "pinia";
import { useStore as useCreateChallengeStore } from "@/store/CreateChallengeStore/index";
import { useStore as useChainCreationFromTemplateStore } from "@/store/ChainCreationFromTemplateStore/index";
import { useStore as useChallengeTemplatesStore } from "@/store/ChallengeTemplatesStore/index";
import { organizationSettingsStore } from "@/store/organization-settings";

import Datepicker from "@vuepic/vue-datepicker";
import vSelect from "vue-select";
import CreateChallengeSettings from "@/components/ChallengesElements/CreateChallengeElements/CreateChallengeSettings.vue";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "CreateChainChallengeFromTemplate",
  components: {
    Datepicker,
    vSelect,
    CreateChallengeSettings,
    CloseIcon,
  },
  props: {
    currentStep: {
      required: true,
    },
    totalSteps: {
      required: true,
    },

    chainId: {
      required: true,
    },
    selectedChallengesList: {
      required: true,
    },
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),

      sponsorList: [],
      challengeData: {
        name: "",
        description: "",
        start_at: "",
        end_at: "",
        start_balance: "",
        parameter_id: 2,
        parameter_value: "",
        challenge_type: "",
        show_contenders: "",
        multiple_reports: "",
        account_id: "",
      },

      delayedStart: false,
    };
  },
  computed: {
    ...mapStores(useCreateChallengeStore),
    ...mapStores(useChainCreationFromTemplateStore),
    ...mapStores(useChallengeTemplatesStore),

    isLastStep() {
      if (this.currentStep == this.totalSteps) {
        return true;
      }
    },
    challengeListItemIndex() {
      return this.currentStep - 1;
    },
    periodStartDate() {
      return new Date(this.organizationSettings.periodStartDate);
    },
    periodEndDate() {
      return new Date(this.organizationSettings.periodEndDate);
    },
  },
  watch: {
    currentStep() {
      // this.setDataFromChallengeTemplate();
      setTimeout(() => {
        this.fillChallengeData();
      }, 500);
    },
  },
  methods: {
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
    addToSend() {
      let challengeDataToSend = {
        template_id: this.selectedChallengesList[this.currentStep - 1].id,
        name: this.challengeData.name,
        description: this.challengeData.description,

        end_at: this.setDate(this.challengeData.end_at),
        start_balance: this.challengeData.start_balance
          ? this.challengeData.start_balance
          : "",
        parameter_id: 2,
        parameter_value: this.challengeData.parameter_value
          ? this.challengeData.parameter_value
          : "",
        challenge_type: this.createChallengeStore.selectedChallengeType.type,
        show_contenders: this.createChallengeStore?.showParticipants
          ? "yes"
          : "no",
        multiple_reports: this.createChallengeStore?.multiple_reports
          ? "yes"
          : "no",
        account_id: this.challengeData.account_id?.id
          ? this.challengeData.account_id.id
          : "",
      };
      if (this.delayedStart) {
        challengeDataToSend.start_at = this.setDate(
          this.challengeData.start_at
        );
      }
      this.chainCreationFromTemplateStore.setValueForChallengeListItem(
        challengeDataToSend,
        this.currentStep - 1
      );

      this.challengeData = {
        name: "",
        description: "",
        start_at: "",
        end_at: "",
        start_balance: "",
        parameter_id: 2,
        parameter_value: "",
        challenge_type: "",
        show_contenders: "",
        multiple_reports: "",
        account_id: "",
      };
    },
    nextStep() {
      this.addToSend();
      setTimeout(() => {
        this.$emit("nextStep");
      }, 100);
    },
    prevStep() {
      this.$emit("prevStep");
    },
    async getSponsors() {
      try {
        const response = await axios.get(API_URIS.createChallenge);
        this.createSponsorList(response.data);
      } catch (err) {
        throw err;
      }
    },
    createSponsorList(data) {
      let personalAccounts = data?.accounts?.personal_accounts;
      let orgAccounts = data?.accounts?.organization_accounts;

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
      this.sponsorList = accounts;
    },
    fillChallengeData() {
      if (
        this.chainCreationFromTemplateStore.challengeList[this.currentStep - 1]
      ) {
        this.challengeData.name =
          this.chainCreationFromTemplateStore.challengeList[
            this.currentStep - 1
          ].name;
        this.challengeData.description =
          this.chainCreationFromTemplateStore.challengeList[
            this.currentStep - 1
          ].description;
        this.challengeData.start_at =
          this.chainCreationFromTemplateStore.challengeList[
            this.currentStep - 1
          ].start_at;
        this.challengeData.end_at =
          this.chainCreationFromTemplateStore.challengeList[
            this.currentStep - 1
          ].end_at;
        this.challengeData.start_balance =
          this.chainCreationFromTemplateStore.challengeList[
            this.currentStep - 1
          ].start_balance;
        this.challengeData.parameter_id =
          this.chainCreationFromTemplateStore.challengeList[
            this.currentStep - 1
          ].parameter_id;
        this.challengeData.parameter_value =
          this.chainCreationFromTemplateStore.challengeList[
            this.currentStep - 1
          ].parameter_value;
        this.challengeData.challenge_type =
          this.chainCreationFromTemplateStore.challengeList[
            this.currentStep - 1
          ].challenge_type;
        this.challengeData.show_contenders =
          this.chainCreationFromTemplateStore.challengeList[
            this.currentStep - 1
          ].show_contenders;
        this.challengeData.multiple_reports =
          this.chainCreationFromTemplateStore.challengeList[
            this.currentStep - 1
          ].multiple_reports;
        this.challengeData.account_id = this.sponsorList.find(
          (el) =>
            el.id ==
            this.chainCreationFromTemplateStore.challengeList[
              this.currentStep - 1
            ].account_id
        );
      }
    },
    async setDataFromChallengeTemplate() {
      try {
        let params = {
          offset: 1,
          limit: 10000,
          scope:
            this.challengeTemplatesStore.selectedCategoryNavigationTab.scope,
          chain: this.chainId,
        };
        let response = await axios.get(API_URIS.getChallengesTemplates, {
          params,
        });
        let data = response.data.reverse();
        for (let i = 0; i < this.totalSteps; i++) {
          this.chainCreationFromTemplateStore.setChallengeListItem({
            template_id: data[i].id,
            name: data[i].name,
            description: data[i].description,
            start_at: "",
            end_at: "",
            start_balance: "",
            parameter_id: 2,
            parameter_value: "",
            challenge_type: "",
            show_contenders: "",
            multiple_reports: "",
            account_id: "",
          });
        }
      } catch (err) {
        throw err;
      }
    },
    createChain() {
      let challengeDataToSend = {
        template_id: this.selectedChallengesList[this.currentStep - 1].id,
        name: this.challengeData.name,
        description: this.challengeData.description,

        end_at: this.setDate(this.challengeData.end_at),
        start_balance: this.challengeData.start_balance
          ? this.challengeData.start_balance
          : "",
        parameter_id: 2,
        parameter_value: this.challengeData.parameter_value
          ? this.challengeData.parameter_value
          : "",
        challenge_type: this.createChallengeStore.selectedChallengeType.type,
        show_contenders: this.createChallengeStore?.showParticipants
          ? "yes"
          : "no",
        multiple_reports: this.createChallengeStore?.multiple_reports
          ? "yes"
          : "no",
        account_id: this.challengeData.account_id?.id
          ? this.challengeData.account_id.id
          : "",
      };
      if (this.delayedStart) {
        challengeDataToSend.start_at = this.setDate(
          this.challengeData.start_at
        );
      }
      this.chainCreationFromTemplateStore.setValueForChallengeListItem(
        challengeDataToSend,
        this.currentStep - 1
      );
      setTimeout(() => {
        this.$emit("createChain");
      }, 300);
    },
  },
  mounted() {
    this.getSponsors();
    setTimeout(() => {
      this.setDataFromChallengeTemplate();
      this.fillChallengeData();
    }, 1000);
  },
};
</script>

<style scoped>
.create_chain_challenge_from_template_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.form_header {
  width: 100%;
}
.header_title {
  font-size: 20px;
  line-height: 23px;
  font-weight: 500;
  font-family: "Ubuntu";
  text-align: left;
  color: var(--generalContrast);
  margin: 0;
  text-align: left;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.header_description {
  text-align: left;
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
._open_settings_button {
  width: 100%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--secondaryColorBrand);
  font-size: 16px;
  font-weight: 400;
  font-family: "Roboto";
  color: var(--generalBrand);
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