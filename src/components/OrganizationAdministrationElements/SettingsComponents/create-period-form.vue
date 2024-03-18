<template>
  <div class="create_period_form_wrapper">
    <h2 class="form_title">
      {{ $t("organization.settings.createPeriod.form.title") }}
    </h2>
    <div class="form_inputs">
      <div class="date_inputs">
        <div class="input_wrapper">
          <h5 class="input_title">
            {{ $t("organization.settings.createPeriod.form.startDate") }}
          </h5>
          <Datepicker
            v-model="periodStartDate"
            class="period_date_picker"
            text-input
            auto-apply
            format="dd.MM.yyyy"
            locale="ru"
            position="left"
            placeholder="17.03.2023"
            :enable-time-picker="false"
            :disabled="!enterPeriodManualy"
          >
            <template #clear-icon="{ clear }">
              <CloseIcon @click="clear" />
            </template>
          </Datepicker>
        </div>
        <div class="input_wrapper">
          <h5 class="input_title">
            {{ $t("organization.settings.createPeriod.form.endDate") }}
          </h5>
          <Datepicker
            v-model="periodEndDate"
            class="period_date_picker"
            text-input
            auto-apply
            format="dd.MM.yyyy"
            locale="ru"
            position="left"
            placeholder="18.03.2023"
            :enable-time-picker="false"
            :disabled="!enterPeriodManualy"
          >
            <template #clear-icon="{ clear }">
              <CloseIcon @click="clear" />
            </template>
          </Datepicker>
        </div>
      </div>
    </div>
    <div class="form_buttons">
      <button class="start_button" @click="startPeriod">
        {{ $t("organization.settings.createPeriod.form.start") }}
      </button>
      <button class="manually_button" @click="enterManualy">
        {{ $t("organization.settings.createPeriod.form.fillManually") }}
      </button>
    </div>
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "CreatePeriodForm",
  components: {
    Datepicker,
    CloseIcon,
  },
  data() {
    return {
      periodStartDate: new Date(),
      periodEndDate: new Date(new Date(new Date().getFullYear()), 11, 31),

      enterPeriodManualy: false,
    };
  },
  methods: {
    enterManualy() {
      if (this.enterPeriodManualy == false) {
        this.enterPeriodManualy = true;
      } else if (this.enterPeriodManualy == true) {
        this.enterPeriodManualy = false;
        this.periodStartDate = new Date();
        this.periodEndDate = new Date(
          new Date(new Date().getFullYear()),
          11,
          31
        );
        this.distrAmount = null;
      }
    },
    startPeriod() {
      this.$emit("startPeriod", {
        startDate: this.periodStartDate,
        endDate: this.periodEndDate,
      });
    },
  },
};
</script>

<style scoped>
.create_period_form_wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
}
.form_title {
  margin: 0;
  font-family: "Golos";
  font-size: 28px;
  font-weight: 500;
  color: var(--generalContrast);
}
.form_inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.date_inputs {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}
.input_wrapper {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
.input_title {
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  color: var(--generalColorSecondary);
  margin: 0;
}
.period_date_picker {
  width: 100%;
}
::v-deep(.dp__input) {
  height: 52px !important;
  padding: 0 0 0 16px !important;
  background-color: var(--generalColorWhite);
  font-size: 14px;
  font-weight: 400;
  font-family: "SF Pro Text";
  border: 1px solid var(--generalColorGrey) !important;
  border-radius: 12px !important;
}
.input_value {
  width: 97%;
  height: 46px;
  padding: 0 0 0 12px;
  outline: none;
  background-color: var(--conditionalItemBackgroundHover) !important;
  border: 1px solid var(--negativeSecondary);
  border-radius: 5px;
}
.form_buttons {
  display: flex;
  width: 100%;
  gap: 10px;
}
.start_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--generalBrand);
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  color: var(--generalColorWhite);
}
.manually_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
  background-color: var(--secondaryColorBrand);
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  color: var(--generalBrand);
}
@media (max-width: 580px) {
  .date_inputs {
    flex-direction: column;
  }
  .form_buttons {
    flex-direction: column;
  }
  .start_button {
    width: 100%;
  }
  .manually_button {
    width: 100%;
  }
}
</style>