<template>
  <div class="voting_time_config_screen_wrapper">
    <div class="voting_time_config_screen general-white-bg">
      <h1 class="voting_time_config_header general-contrast-color">
        {{ $t("surveys.voting_time") }}
      </h1>
      <h1 class="voting_time_config_description general-secondary-color">
        {{ $t("surveys.configure_start_and_end_date") }}
      </h1>
      <div class="datepicker_wrapper" ref="startPicker">
        <Datepicker
          v-model="dateRangeStart"
          text-input
          auto-apply
          format="dd.MM.yyyy"
          :clearable="true"
          :placeholder="$t('general.date_from_capital')"
          :enable-time-picker="false"
        />
        <CalendarIcon class="calendar_icon" @click="triggerStartPicker" />
      </div>
      <div class="datepicker_wrapper" ref="endPicker">
        <Datepicker
          v-model="dateRangeEnd"
          text-input
          auto-apply
          format="dd.MM.yyyy"
          :clearable="true"
          :placeholder="$t('general.to_capital')"
          :enable-time-picker="false"
        />
        <CalendarIcon class="calendar_icon" @click="triggerEndPicker" />
      </div>
      <div class="action_buttons general-white-bg">
        <button
          @click="$emit('confirmVotingTimeChanges', dateRangeStart, dateRangeEnd)"
          class="action_button general-brand-bg general-white-color"
        >
          {{ $t("surveys.continue") }}
        </button>
        <button
          @click="$emit('cancelVotingTimeChanges')"
          class="action_button brand-secondary-bg general-brand-color"
        >
          {{ $t("surveys.back") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import CalendarIcon from "../Icons/SurveyIcons/CalendarIcon.vue";

export default {
  name: "ConfigureVotingTimeScreen",
  components: {
    Datepicker,
    CalendarIcon
},
  data() {
    return {
      dateRangeStart: null,
      dateRangeEnd: null
    };
  },
  methods: {
    triggerStartPicker() {
      const datePickerInput = this.$refs.startPicker.querySelector(".dp__input");
      datePickerInput.click();
    },
    triggerEndPicker() {
      const datePickerInput = this.$refs.endPicker.querySelector(".dp__input");
      datePickerInput.click();
    },
  },
};
</script>

<style scoped>
.voting_time_config_screen_wrapper {
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
.voting_time_config_screen {
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 52px 32px 32px 32px;
  gap: 24px;
  margin: auto;
}
.voting_time_config_header {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 600;
  line-height: 23px;
  text-align: left;
}
.voting_time_config_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.datepicker_wrapper {
  position: relative;
}

::v-deep(.dp__input) {
  z-index: 12;
  padding: 14px 16px !important;
  border-radius: 12px !important;
}
.calendar_icon {
  z-index: 1;
  height: 24px;
  width: 24px;
  position: absolute;
  right: 15px;
  top: 12px;
}
.action_buttons {
  width: 100%;
  display: flex;
  gap: 12px;
  border-radius: 0px 0px 24px 24px;
}
.action_button {
  width: 50%;
  border-radius: 6px;
  padding: 16px;
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}
</style>
