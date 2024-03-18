<template>
  <div class="challenge_settings">
    <div class="toggle_settings_list" v-for="item in settings">
      <h1 class="toggle_settings_header general-contrast-color">
        {{ item.header }}
      </h1>
      <button
        class="toggle_settings_button general-white-bg"
        @click="item.click"
      >
        <img
          class="toggle_button_image"
          :src="
            item.isOn
              ? getImgUrl('SettingsToggleButtonOn')
              : getImgUrl('SettingsToggleButtonOff')
          "
        />
      </button>
    </div>
    <div class="deferred_challenge_creation">
      <div class="deferred_challenge_checkbox general-contrast-color">
        <input
          type="checkbox"
          class="checkbox general-white-bg"
          v-model="challengeDeferred"
        />
        {{ $t("challenges.create_challenge.deferred_creation") }}
      </div>
      <Datepicker
        v-if="challengeDeferred"
        v-model="challengeStartDate"
        class="challenge_date_picker"
        text-input
        auto-apply
        format="dd.MM.yyyy HH:mm"
        locale="ru"
        position="left"
        :placeholder="$t('challenges.create_challenge.end_date')"
        :enable-time-picker="true"
        :clearable="true"
      >
        <template #clear-icon="{ clear }">
          <CloseIcon @click="clear" />
        </template>
      </Datepicker>
    </div>
    <vSelect
      v-model="selectedSettingsItem"
      :options="settingsList"
      :placeholder="$t('challenges.challenge_settings.choose_challenge_type')"
      label="name"
      :clearable="false"
    />
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import vSelect from "vue-select";
import { API_URIS } from "@/constants/api";
import axios from "axios";
import ChallengeSettingsSelectList from "./ChallengeSettingsSelectList.vue";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "ChallengeSettings",
  components: {
    ChallengeSettingsSelectList,
    vSelect,
    Datepicker,
    CloseIcon,
  },
  props: {
    challengeType: {},
    additionalSettings: {},
  },
  data() {
    return {
      accounts: [],
      challengeStartDate: null,

      challengeDeferred: false,

      showParticipants: "yes",
      severalReports: "yes",
      settingsList: [],
      selectedSettingsItem: null,
      selectedSponsor: null,
    };
  },
  watch: {
    challengeStartDate: {
      handler(newVal) {
        this.$emit("challengeStartTimeSelected", newVal);
      },
    },
    selectedSettingsItem: {
      handler(newVal) {
        this.$emit("settingsOptionSelected", newVal);
      },
    },
    additionalSettings: {
      handler(newVal) {
        if (newVal) {
          this.getChallengeSettings();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    isShowParticipants() {
      this.$emit("changeShowParticipantsOption", this.showParticipants);
      return this.showParticipants === "yes";
    },
    isSeveralReprots() {
      this.$emit("changeSeveralReportsOption", this.severalReports);
      return this.severalReports === "yes";
    },
    settings() {
      let toggleSettingsList = [];
      toggleSettingsList.push({
        isOn: this.isSeveralReprots,
        header: this.$t("challenges.challenge_settings.multiple_reports"),
        click: () => {
          this.severalReports == "yes"
            ? (this.severalReports = "no")
            : (this.severalReports = "yes");
        },
      });
      if (this.selectedSettingsItem?.type != "voting") {
        toggleSettingsList.push({
          isOn: this.isShowParticipants,
          header: this.$t("challenges.challenge_settings.show_participants"),
          click: () => {
            this.showParticipants == "yes"
              ? (this.showParticipants = "no")
              : (this.showParticipants = "yes");
          },
        });
      }
      return toggleSettingsList;
    },
    selectedSettingsOption() {
      if (this.selectedSettingsItem) return this.selectedSettingsItem;
      else {
        if (this.settingsList.length) return this.settingsList[0];
        else return null;
      }
    },
  },
  methods: {
    getImgUrl(imageName) {
      var images = require.context(
        "@/assets/CreateChallengeImages",
        false,
        /\.png$/
      );
      return images("./" + imageName + ".png");
    },
    getChallengeSettings() {
      const settings = this.additionalSettings;
      this.accounts = settings.accounts;
      this.showParticipants = settings.show_contenders;
      this.severalReports = settings.multiple_reports;
      if (settings.types.default) {
        this.settingsList.push({
          name: this.$t("challenges.challenge_settings.default_type"),
          id: settings.types.default,
          type: "default",
        });
      }
      if (settings.types.voting) {
        this.settingsList.push({
          name: this.$t("challenges.challenge_settings.voting_type"),
          id: settings.types.voting,
          type: "voting",
        });
      }
      for (let i = 0; i < this.settingsList.length; ++i) {
        if (this.settingsList[i].type == this.challengeType) {
          this.selectedSettingsItem = this.settingsList[i];
          break;
        }
      }
    },
  },
};
</script>

<style scoped>
.toggle_settings_list {
  display: flex;
  justify-content: space-between;
}
.toggle_settings_button {
  padding: 0px;
}
.toggle_settings_header {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.toggle_button_image {
  height: 30px;
  width: 40px;
}
.deferred_challenge_creation {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
}
.deferred_challenge_checkbox {
  display: flex;
  gap: 8px;
  align-items: center;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.checkbox {
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
  min-width: 20px;
  width: 20px;
  height: 20px;
  background-color: var(--generalColorWhite);
  border-radius: 2px !important;
  border: 1px solid var(--neutral5) !important;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: 0.3s;
}
.checkbox:checked {
  background-color: var(--generalBrand);
  background-image: url("@/assets/checkMark.png");
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.1s;
}
</style>
