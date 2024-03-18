<template>
  <div class="settings_general">
    <h2 class="settings_general_title">
      {{ $t("tests.settings.generalSettings.title") }}
    </h2>
    <div class="settings_general_item">
      <div class="_item_main">
        <div class="_item_text">
          <h3 class="_item_title">
            {{ $t("tests.settings.generalSettings.availability") }}
          </h3>
          <h5 class="_item_description">
            {{ $t("tests.settings.generalSettings.availabilityDescription") }}
          </h5>
        </div>
        <div class="item_switch">
          <label class="switch">
            <input type="checkbox" v-model="testAvailability" />
            <span class="slider round"></span>
          </label>
        </div>
      </div>
      <Transition name="fade" mode="out-in">
        <div class="_item_content" v-if="testAvailability">
          <div class="date_wrapper">
            <Datepicker
              v-model="testStartDate"
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
              <template #input-icon v-if="!testStartDate">
                <CalendarIcon :currentColor="getIconColor()" />
              </template>
            </Datepicker>
          </div>
          <div class="date_wrapper">
            <Datepicker
              v-model="testEndDate"
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
              <template #input-icon v-if="!testEndDate">
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
            v-model="testAccessCondition"
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
import { SURVEY_ACCESS_CONDITIONS } from "@/infrastructure/constants/survey-access-condition";
import { SURVEY_ACCESS } from "@/infrastructure/data-sources/survey-access";
import { SURVEY_PERMITION_TYPE } from "@/infrastructure/constants/survey-permition-type";

import Datepicker from "@vuepic/vue-datepicker";
import CalendarIcon from "@/components/Icons/calendar.vue";
import CloseIcon from "@/components/Icons/close.vue";
import SettingsGeneralTimeLimitPicker from "@/components/TestElements/TestManagementSettings/SettingsGeneralTimeLimitPicker.vue";
import SettingsAccessList from "@/components/TestElements/TestManagementSettings/SettingsAccessList.vue";
import BaseSmallPopup from "@/components/app/SmallPopup.vue";

export default {
  name: "SettingsGeneral",
  components: {
    Datepicker,
    CalendarIcon,
    CloseIcon,
    SettingsGeneralTimeLimitPicker,
    SettingsAccessList,
    BaseSmallPopup,
  },
  data() {
    return {
      testAvailability: false,
      testStartDate: "",
      testEndDate: "",
      timeLimit: false,
      testAccessCondition: "",
    };
  },
  computed: {
    surveyAccessList() {
      return SURVEY_ACCESS(this);
    },
  },
  watch: {},
  testAvailability() {
    this.setDefaultDate();
    if (!this.testAvailability) {
      this.testStartDate = null;
      this.testEndDate = null;
      this.updateStartDate();
      this.updateEndDate();
    }
  },
  methods: {
    getIconColor() {
      let color = getComputedStyle(document.documentElement).getPropertyValue(
        "--generalContrast"
      );
      return color;
    },
    async timeLimitChanged(time) {
      console.log(time);
    },
    setDefaultDate() {
      if (!this.testStartDate && !this.testEndDate && this.testAvailability) {
        let currentDate = new Date();
        let nextWeek = new Date();
        nextWeek.setDate(currentDate.getDate() + 7);

        this.testStartDate = currentDate;
        this.testEndDate = nextWeek;
      }
    },
    openAccessListPopup() {
      this.$refs.accessList.open();
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
      console.log(this.testStartDate);
    },
    async updateEndDate() {
      console.log(this.testEndDate);
    },
    async listSaved() {
      this.closeAccessListPopup();
    },
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
  text-align: left;
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