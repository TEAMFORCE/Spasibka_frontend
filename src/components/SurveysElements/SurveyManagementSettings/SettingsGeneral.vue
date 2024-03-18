<template>
  <div class="settings_general" v-if="surveyInfo">
    <h2 class="settings_general_title">
      {{ $t("surveys.management_settings.title") }}
    </h2>
    <div class="settings_general_item">
      <div class="_item_main">
        <div class="_item_text">
          <h3 class="_item_title">
            {{ $t("surveys.management_settings.survey_availability") }}
          </h3>
          <h5 class="_item_description">
            {{ $t("surveys.management_settings.survey_availabilityDesc") }}
          </h5>
        </div>
        <div class="item_switch">
          <label class="switch">
            <input type="checkbox" v-model="surveyAvailability" />
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <Transition name="fade" mode="out-in">
        <div class="_item_content" v-if="surveyAvailability">
          <div class="date_wrapper">
            <Datepicker
              v-model="surveyStartDate"
              text-input
              auto-apply
              format="dd.MM.yyyy"
              locale="ru"
              position="left"
              :clearable="true"
              :enable-time-picker="false"
              :placeholder="$t('surveys.management_settings.survey_start_date')"
            >
              <template #clear-icon="{ clear }">
                <CloseIcon @click="clear" />
              </template>
              <template #input-icon v-if="!surveyStartDate">
                <CalendarIcon :currentColor="getIconColor()" />
              </template>
            </Datepicker>
          </div>
          <div class="date_wrapper">
            <Datepicker
              v-model="surveyEndDate"
              text-input
              auto-apply
              format="dd.MM.yyyy"
              locale="ru"
              position="left"
              :clearable="true"
              :enable-time-picker="false"
              :placeholder="$t('surveys.management_settings.survey_end_date')"
            >
              <template #clear-icon="{ clear }" class="_clear">
                <CloseIcon @click="clear" />
              </template>
              <template #input-icon v-if="!surveyEndDate">
                <CalendarIcon :currentColor="getIconColor()" />
              </template>
            </Datepicker>
          </div>
        </div>
      </Transition>
    </div>
    <div class="_divider"></div>
    <div class="settings_general_item">
      <div class="_item_main">
        <div class="_item_text">
          <h3 class="_item_title">
            {{ $t("surveys.management_settings.time_limit") }}
          </h3>
          <h5 class="_item_description">
            {{ $t("surveys.management_settings.time_limitDesc") }}
          </h5>
        </div>
        <div class="item_switch">
          <label class="switch">
            <input type="checkbox" v-model="timeLimit" />
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <Transition name="fade" mode="out-in">
        <div class="_item_content" v-show="timeLimit">
          <SettingsGeneralTimeLimitPicker
            ref="timeLimitPicker"
            @timeLimitChanged="timeLimitChanged"
          />
        </div>
      </Transition>
    </div>
    <div class="_divider"></div>
    <div class="settings_general_item">
      <div class="_item_main">
        <div class="_item_text">
          <h3 class="_item_title">
            {{ $t("surveys.management_settings.survey_access") }}
          </h3>
          <h5 class="_item_description">
            {{ $t("surveys.management_settings.survey_accessDesc") }}
          </h5>
        </div>
        <div class="item_select">
          <vSelect
            class="style-chooser"
            v-model="surveyAccessCondition"
            :options="surveyAccessList"
            :placeholder="
              $t('surveys.management_settings.access_list.placeholder')
            "
            label="title"
          >
            <template #option="{ condition, title }">
              <h5
                class="_access_option"
                @click="accessConditionChanged(condition)"
              >
                {{ title }}
              </h5>
            </template>
          </vSelect>
        </div>
      </div>
    </div>
    <BaseSmallPopup ref="accessList">
      <SettingsAccessList
        @listSaved="listSaved"
        @cancel="closeAccessListPopup"
      />
    </BaseSmallPopup>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { SURVEY_ACCESS_CONDITIONS } from "@/infrastructure/constants/survey-access-condition";
import { SURVEY_ACCESS } from "@/infrastructure/data-sources/survey-access";
import { SURVEY_PERMITION_TYPE } from "@/infrastructure/constants/survey-permition-type";

import { mapStores } from "pinia";
import { useStore as useSurveyUserPermissionStore } from "@/store/SurveyUserPermissionStore/index";
import { useStore as useSurveyStore } from "@/store/SurveyStore/index";

import { notify } from "@/general-scripts/toast-notification";

import Datepicker from "@vuepic/vue-datepicker";
import CalendarIcon from "@/components/Icons/calendar.vue";
import SettingsGeneralTimeLimitPicker from "@/components/SurveysElements/SurveyManagementSettings/SettingsGeneralTimeLimitPicker.vue";
import SettingsAccessList from "@/components/SurveysElements/SurveyManagementSettings/SettingsAccessList.vue";
import BaseSmallPopup from "@/components/app/SmallPopup.vue";
import CloseIcon from "@/components/Icons/close.vue";

import vSelect from "vue-select";

export default {
  name: "SettingsGeneral",
  components: {
    Datepicker,
    CalendarIcon,
    SettingsGeneralTimeLimitPicker,
    SettingsAccessList,
    BaseSmallPopup,
    CloseIcon,
    vSelect,
  },
  props: {
    surveyInfo: {
      required: true,
    },
  },
  data() {
    return {
      surveyAvailability: false,
      surveyStartDate: "",
      surveyEndDate: "",
      timeLimit: false,
      surveyAccessCondition: "",
    };
  },
  computed: {
    ...mapStores(useSurveyUserPermissionStore),
    ...mapStores(useSurveyStore),
    surveyAccessList() {
      return SURVEY_ACCESS(this);
    },
  },
  watch: {
    surveyAvailability() {
      this.setDefaultDate();
      if (!this.surveyAvailability) {
        this.surveyStartDate = null;
        this.surveyEndDate = null;
        this.updateStartDate();
        this.updateEndDate();
      }
    },
    timeLimit() {
      this.setDefaultTimelimit();
      if (!this.timeLimit) {
        this.$refs.timeLimitPicker.setMinutes(0);
        this.$refs.timeLimitPicker.setDays(0);
        this.$refs.timeLimitPicker.setHours(0);
      }
    },
    surveyStartDate() {
      if (this.surveyStartDate) {
        this.surveyStore.setStartDate(this.surveyStartDate);
        if (
          !this.isSameDates(this.surveyStartDate, this.surveyInfo.started_at)
        ) {
          this.updateStartDate();
        }
      }
    },
    surveyEndDate() {
      if (this.surveyEndDate) {
        this.surveyStore.setEndDate(this.surveyEndDate);
        if (
          !this.isSameDates(this.surveyEndDate, this.surveyInfo.finished_at)
        ) {
          this.updateEndDate();
        }
      }
    },
  },
  methods: {
    isSameDates(dateFromStore, dateFromrequest) {
      return `${new Date(dateFromStore)}` == `${new Date(dateFromrequest)}`;
    },
    getIconColor() {
      let color = getComputedStyle(document.documentElement).getPropertyValue(
        "--generalContrast"
      );
      return color;
    },
    async openAccessListPopup() {
      if (this.surveyInfo.permission_type === SURVEY_PERMITION_TYPE.allUsers) {
        try {
          await axios.post(API_URIS.questionnariesPermissionList, {
            questionnaire: this.$route.params.id,
            users: [],
          });
          this.$refs.accessList.open();
        } catch (err) {
          throw err;
        }
      } else {
        this.$refs.accessList.open();
      }
    },
    closeAccessListPopup() {
      this.$refs.accessList.close();
    },
    accessConditionChanged(condition) {
      if (condition === SURVEY_ACCESS_CONDITIONS.someUsers) {
        this.openAccessListPopup();
      } else {
        setTimeout(() => {
          this.listSaved();
        }, 50);
      }
    },
    async updateStartDate() {
      try {
        await axios.patch(
          API_URIS.questionnaries + this.$route.params.id + "/",
          {
            started_at: this.surveyStartDate,
          }
        );
        notify(
          this.$t("surveys.management_settings.notifications.startDateChanged"),
          "success"
        );
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    async updateEndDate() {
      try {
        let suggestedEndDate = new Date(this.surveyEndDate);
        let curDate = new Date();
        if (curDate > suggestedEndDate) {
          throw new Error(
            this.$t("surveys.survey_end_date_cannot_be_in_the_past")
          );
        }
        await axios.patch(
          API_URIS.questionnaries + this.$route.params.id + "/",
          {
            finished_at: this.surveyEndDate,
          }
        );
        notify(
          this.$t("surveys.management_settings.notifications.endDateChanged"),
          "success"
        );
      } catch (err) {
        notify(err?.message || this.$t("notification.error"));
        throw err;
      }
    },
    async listSaved() {
      this.closeAccessListPopup();
      if (
        this.surveyAccessCondition?.condition == SURVEY_ACCESS_CONDITIONS.all
      ) {
        try {
          await axios.post(API_URIS.questionnariesPermissionList, {
            all_users: true,
            questionnaire: this.$route.params.id,
          });
          notify(this.$t("surveys.permission_added"), "success");
        } catch (err) {
          notify(
            err?.response?.data || err?.message || this.$t("notification.error")
          );
          throw err;
        }
      } else {
        try {
          await axios.post(API_URIS.questionnariesPermissionList, {
            questionnaire: this.$route.params.id,
            users: this.surveyUserPermissionStore.userListForSend,
          });
          notify(this.$t("surveys.permission_added"), "success");
        } catch (err) {
          notify(
            err?.response?.data || err?.message || this.$t("notification.error")
          );
          throw err;
        }
      }
    },
    async timeLimitChanged(time) {
      this.surveyStore.setTimelimit(time);
      try {
        await axios.patch(
          API_URIS.questionnaries + this.$route.params.id + "/",
          {
            timelimit: time,
          }
        );
      } catch (err) {
        throw err;
      }
    },
    setSettingsFromStore() {
      if (this.surveyStore.started_at || this.surveyStore.finished_at) {
        this.surveyAvailability = true;
        this.surveyStartDate = this.surveyStore.started_at;
        this.surveyEndDate = this.surveyStore.finished_at;
      }
      if (
        this.surveyStore.timelimitpickerDays ||
        this.surveyStore.timelimitpickerHours ||
        this.surveyStore.timelimitpickerMinutes
      ) {
        this.timeLimit = true;
      }
    },
    checkIsAll() {
      if (this.surveyInfo.permission_type === SURVEY_PERMITION_TYPE.allUsers) {
        this.surveyAccessCondition = this.surveyAccessList[0];
      } else {
        this.surveyAccessCondition = this.surveyAccessList[1];
      }
    },
    setDefaultDate() {
      if (
        !this.surveyStartDate &&
        !this.surveyEndDate &&
        this.surveyAvailability
      ) {
        let currentDate = new Date();
        let nextWeek = new Date();
        nextWeek.setDate(currentDate.getDate() + 7);

        this.surveyStartDate = currentDate;
        this.surveyEndDate = nextWeek;
      }
    },
    setDefaultTimelimit() {
      if (!this.surveyInfo.timelimit && this.timeLimit) {
        setTimeout(() => {
          this.$refs.timeLimitPicker.setMinutes(30);
        }, 500);
      }
    },
  },
  mounted() {
    this.setSettingsFromStore();
    this.checkIsAll();
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.settings_general {
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
}
.settings_general_title {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 500;
  margin: 0;
  color: var(--generalContrast);
}
.settings_general_item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
}
._item_main {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
._item_text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
._item_title {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 400;
  line-height: 23px;
  margin: 0;
  color: var(--generalContrast);
  text-align: left;
}
._item_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin: 0;
  color: var(--generalColorSecondary);
}
.item_select {
  width: 270px;
  height: 52px;
}
::v-deep(.v-select) {
  height: 52px !important;
}
::v-deep(.vs__dropdown-toggle) {
  height: 52px !important;
}
._select_icon {
  width: 13px;
  margin: 0 0 2px 0;
}
._access_option {
  margin: 4px 0;
  font-family: "Golos" !important;
  font-size: 16px;
  font-weight: 300;
  text-align: left !important;
  margin: 2px 0 0 0;
  color: var(--generalContrast);
  cursor: pointer;
}

._item_content {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
}
.date_wrapper {
  width: 270px;
  height: 52px;
}
::v-deep(.dp__input) {
  font-size: 14px !important;
  height: 52px !important;
  border-radius: 12px !important;
}
.input-slot-image {
  width: 24px;
  margin: 6px 10px 0 0;
}
.calendar_icon {
  width: 18px;
  position: absolute;
  top: -10px;
  left: 236px;
}
._divider {
  width: 100%;
  height: 1px;
  background-color: var(--negativeSecondary);
}
</style>