<template>
  <div class="fire_employee_screen_wrapper">
    <div class="fire_employee_wrapper">
      <div class="fire_employee general-white-bg">
        <h1 class="fire_employee_text general-contrast-color">
          {{ $t("employee.employee_actions.fire") }}
        </h1>
        <div class="input_field_wrapper">
          <div
            v-if="fireDate && fireDate != 'Invalid Date'"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_actions.fireDate") }}
          </div>
          <Datepicker
            class="challenge_date_picker"
            v-model="fireDate"
            text-input
            auto-apply
            format="dd.MM.yyyy"
            locale="ru"
            position="left"
            timezone="UTC"
            :placeholder="$t('employee.employee_actions.fireDate')"
            :enable-time-picker="false"
          >
            <template #clear-icon="{ clear }">
              <CloseIcon @click="clear" />
            </template>
          </Datepicker>
        </div>
        <div class="fire_or_cancel_buttons">
          <button
            class="fire_or_cancel_button general-brand-bg"
            @click="$emit('fireEmployee', fireDate)"
          >
            <h1 class="fire_or_cancel_button_text general-white-color">
              {{ $t("employee.employee_actions.yes") }}
            </h1>
          </button>
          <button
            class="fire_or_cancel_button brand-secondary-bg"
            @click="$emit('cancelEmployeeFire')"
          >
            <h1 class="fire_or_cancel_button_text general-brand-color">
              {{ $t("employee.employee_actions.cancel") }}
            </h1>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "FireEmployee",
  components: {
    Datepicker,
    CloseIcon,
  },
  data() {
    return {
      fireDate: null,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");

.fire_employee_screen_wrapper {
  position: fixed;
  z-index: 3;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: auto;
}
.fire_employee_wrapper {
  max-width: 477px;
  width: 100%;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
}
.fire_employee {
  position: relative;
  padding: 32px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  z-index: 5;
  gap: 24px;
}
.fire_employee_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
.input_field_wrapper {
  position: relative;
  width: 100%;
}
.input_field_placeholder {
  z-index: 3;
  position: absolute;
  padding: 0px 2px;
  top: -5px;
  left: 15px;
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
}
.challenge_date_picker {
  z-index: 6;
}
.select_fire_date {
  border-radius: 12px;
  border: 1px solid var(--generalColorGrey);
  padding: 16px;
}
.select_fire_date:focus {
  outline: none;
}
.fire_or_cancel_buttons {
  display: flex;
  gap: 12px;
}
.fire_or_cancel_button {
  border-radius: 6px;
  padding: 16px 24px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fire_or_cancel_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  word-break: break-word;
}
</style> 