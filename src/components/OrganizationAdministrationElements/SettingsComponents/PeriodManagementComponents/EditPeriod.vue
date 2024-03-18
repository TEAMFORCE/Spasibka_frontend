<template>
  <div class="edit_period_wrapper">
    <div class="edit_period general-white-bg">
      <h2 class="form_title">
        {{ $t("organization.settings.period_edition") }}
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
            >
              <template #clear-icon="{ clear }">
                <CloseIcon @click="clear" />
              </template>
            </Datepicker>
          </div>
        </div>
      </div>
      <div class="form_buttons">
        <button class="start_button" @click="editPeriod">
          {{ $t("organization.settings.period_edition_save") }}
        </button>
        <button class="manually_button" @click="cancelEdition">
          {{ $t("organization.settings.period_edition_cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "EditPeriod",
  props: {
    selectedRow: {
      required: true,
    },
  },
  components: {
    Datepicker,
    CloseIcon,
  },
  data() {
    return {
      periodStartDate: null,
      periodEndDate: null,

      enterPeriodManualy: false,
    };
  },
  watch: {
    selectedRow: {
      handler() {
        if (this.selectedRow && !this.periodStartDate && !this.periodEndDate) {
          this.periodStartDate = new Date(this.selectedRow.start_date);
          this.periodEndDate = new Date(this.selectedRow.end_date);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    cancelEdition() {
      this.$emit("disablePeriodEdition");
    },
    async editPeriod() {
      try {
        const startDate = this.periodStartDate;
        const startDateString = `${startDate.getFullYear()}-${String(
          startDate.getMonth() + 1
        ).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
        const endDate = this.periodEndDate;
        const endDateString = `${endDate.getFullYear()}-${String(
          endDate.getMonth() + 1
        ).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

        await axios.patch(API_URIS.periodsAPI, {
          period_id: this.selectedRow.id,
          start_date: startDateString,
          end_date: endDateString,
        });
        notify(this.$t("organization.settings.period_edited"), "success");
        this.$emit("disablePeriodEdition", true);
      } catch (err) {
        let errorMessage = "";
        if (
          err?.response?.data?.errors ===
          "Cant change period because of period status. Period status: 2 You can change periods only with no status or status 0"
        ) {
          errorMessage = this.$t(
            "organization.settings.cant_change_active_period"
          );
        } else if (
          err?.response?.data?.errors ===
          "Period end date cant be the same as current"
        ) {
          errorMessage = this.$t(
            "organization.settings.cant_set_same_end_date"
          );
        } else if (
          err?.response?.data?.errors ===
          "end_date should be bigger than start date"
        ) {
          errorMessage = this.$t(
            "organization.settings.end_date_should_be_bigger"
          );
        } else if (
          err?.response?.data?.errors === "start_date should be >= today"
        ) {
          errorMessage = this.$t(
            "organization.settings.start_date_should_be_in_future"
          );
        }
        notify(
          errorMessage ||
            err?.response?.data ||
            err?.message ||
            this.$t("notification.error")
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.edit_period_wrapper {
  position: fixed;
  z-index: 1000;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}
.edit_period {
  width: 100%;
  max-width: 938px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 16px;
}
.form_title {
  text-align: left;
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
.input_title {
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  color: var(--generalColorSecondary);
  margin: 0;
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