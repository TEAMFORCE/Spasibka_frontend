<template>
  <div class="settings_general_time_limit_picker_wrapper">
    <h2 class="settings_general_time_limit_picker_title">
      {{ $t("surveys.management_settings.time") }}
    </h2>
    <div class="settings_general_time_limit_picker">
      <div class="_time_picker_wrapper _days">
        <h3 class="_time_picker_title">
          {{ $t("surveys.management_settings.timeValues.days") }}
        </h3>
        <div
          class="_time_picker_value_wrapper"
          @click="openOrCloseDayList"
          v-click-outside="closeDayList"
        >
          <h3 class="_time_picker_value">
            {{ currentDays }}
          </h3>
          <TopBottomArrowIcon :currentColor="getIconColor()" />
        </div>
        <Transition name="fade" mode="out-in">
          <div class="_time_picker_list" v-if="dayListVisible" @click.stop="">
            <span
              class="_time_picker_list_item"
              v-for="day in days"
              @click="setDays(day)"
            >
              {{ day }}
            </span>
          </div>
        </Transition>
      </div>
      <div
        class="_time_picker_wrapper _hours"
        @click="openOrCloseHoursList"
        v-click-outside="closeHoursList"
      >
        <h3 class="_time_picker_title">
          {{ $t("surveys.management_settings.timeValues.hours") }}
        </h3>
        <div class="_time_picker_value_wrapper">
          <h3 class="_time_picker_value">
            {{ currentHours }}
          </h3>
          <TopBottomArrowIcon :currentColor="getIconColor()" />
        </div>
        <Transition name="fade" mode="out-in">
          <div class="_time_picker_list" v-if="hoursListVisible" @click.stop="">
            <span
              class="_time_picker_list_item"
              v-for="hour in hours"
              @click="setHours(hour)"
            >
              {{ hour }}
            </span>
          </div>
        </Transition>
      </div>
      <div
        class="_time_picker_wrapper _minutes"
        @click="openOrCloseMinutesList"
        v-click-outside="closeMinutesList"
      >
        <h3 class="_time_picker_title">
          {{ $t("surveys.management_settings.timeValues.minutes") }}
        </h3>
        <div class="_time_picker_value_wrapper">
          <h3 class="_time_picker_value">
            {{ currentMinutes }}
          </h3>
          <TopBottomArrowIcon :currentColor="getIconColor()" />
        </div>
        <Transition name="fade" mode="out-in">
          <div
            class="_time_picker_list"
            v-if="minutesListVisible"
            @click.stop=""
          >
            <span
              class="_time_picker_list_item"
              v-for="minute in minutes"
              @click="setMinutes(minute)"
            >
              {{ minute }}
            </span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useStore as useSurveyStore } from "@/store/SurveyStore/index";

import TopBottomArrowIcon from "@/components/Icons/topBottomArrow.vue";

export default {
  name: "SettingsGeneralTimeLimitPicker",
  components: {
    TopBottomArrowIcon,
  },
  data() {
    return {
      currentDays: 0,
      currentHours: 0,
      currentMinutes: 0,

      dayListVisible: false,
      hoursListVisible: false,
      minutesListVisible: false,

      totalTime: "00",
    };
  },
  computed: {
    ...mapStores(useSurveyStore),
    days() {
      let days = [];
      for (let i = 0; i < 31; i++) {
        days.push(i);
      }
      return days;
    },
    hours() {
      let hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push(i);
      }
      return hours;
    },
    minutes() {
      let minutes = [];
      for (let i = 0; i < 60; i++) {
        minutes.push(i);
      }
      return minutes;
    },
  },
  methods: {
    getIconColor() {
      let color = getComputedStyle(document.documentElement).getPropertyValue(
        "--generalColorSecondary"
      );
      return color;
    },
    openOrCloseDayList() {
      this.dayListVisible = !this.dayListVisible;
    },
    closeDayList() {
      this.dayListVisible = false;
    },
    setDays(day) {
      this.currentDays = day;
      this.setTotalTime();
      this.surveyStore.timeLimitPickerSetDays(day);
      this.closeDayList();
    },
    openOrCloseHoursList() {
      this.hoursListVisible = !this.hoursListVisible;
    },
    closeHoursList() {
      this.hoursListVisible = false;
    },
    setHours(hour) {
      this.currentHours = hour;
      this.setTotalTime();
      this.surveyStore.timeLimitPickerSetHours(hour);
      this.closeHoursList();
    },
    openOrCloseMinutesList() {
      this.minutesListVisible = !this.minutesListVisible;
    },
    closeMinutesList() {
      this.minutesListVisible = false;
    },
    setMinutes(minute) {
      this.currentMinutes = minute;
      this.setTotalTime();
      this.surveyStore.timeLimitPickerSetMinutes(minute);
      this.closeMinutesList();
    },
    setTotalTime() {
      let minutes = this.currentMinutes;
      let hours = this.currentHours * 60;
      let days = this.currentDays * 24 * 60;
      this.totalTime = days + hours + minutes;
      this.$emit("timeLimitChanged", this.totalTime);
    },
    setTimeFromStore() {
      if (
        this.surveyStore.timelimitpickerDays ||
        this.surveyStore.timelimitpickerHours ||
        this.surveyStore.timelimitpickerMinutes
      ) {
        this.currentDays = this.surveyStore.timelimitpickerDays;
        this.currentHours = this.surveyStore.timelimitpickerHours;
        this.currentMinutes = this.surveyStore.timelimitpickerMinutes;
      }
    },
  },
  mounted() {
    this.setTimeFromStore();
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

.settings_general_time_limit_picker_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.settings_general_time_limit_picker_title {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 400;
  line-height: 23px;
  margin: 0;
  color: var(--generalContrast);
  text-align: left;
}
.settings_general_time_limit_picker {
  width: 100%;
  max-width: 500px;
  height: 70px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  display: flex;
}
._time_picker_wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  position: relative;
}
._hours {
  border-left: 1px solid var(--negativeSecondary);
  border-right: 1px solid var(--negativeSecondary);
}
._time_picker_title {
  font-family: "Ubuntu";
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  color: var(--generalContrast);
  text-align: center;
}
._time_picker_value_wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
._time_picker_value {
  font-family: "Ubuntu";
  font-size: 22px;
  font-weight: 400;
  margin: 0;
  color: var(--generalColorSecondary);
  text-align: center;
}
.top_bottom_arrow_icon {
  height: 20px;
}
._time_picker_list {
  padding: 10px;
  box-sizing: border-box;
  width: 72px;
  height: 300px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  background-color: var(--generalColorWhite);
  position: absolute;
  top: 110%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
}
._time_picker_list::-webkit-scrollbar {
  width: 16px;
}
._time_picker_list::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  background-clip: content-box;
  border: 5px solid transparent;
  border-radius: 10px;
  width: 16px;
}
._time_picker_list_item {
  width: 50%;
  padding: 0 0 6px 0;
  font-family: "Ubuntu";
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--generalColorSecondary);
  text-align: center;
  border-bottom: 1px solid transparent;
  transition: 0.3s;
  cursor: pointer;
}
._time_picker_list_item:hover {
  color: var(--generalContrast);
  border-bottom: 1px solid var(--generalContrast);
  transform: scale(1.1);
}
</style>