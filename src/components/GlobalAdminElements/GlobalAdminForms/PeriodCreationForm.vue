<template>
  <div class="period_creation_form">
    <h1 class="functionality_header">
      {{ $t("global_admin.period_creation") }}
    </h1>
    <vSelect
      v-model="selectedOrganization"
      :options="globalAdminStore?.organizationsList"
      :placeholder="$t('global_admin.select_organization')"
      label="name"
    />
    <Datepicker
      v-model="startDate"
      text-input
      auto-apply
      format="yyyy-MM-dd"
      :enable-time-picker="false"
      :placeholder="$t('global_admin.start_date')"
      :clearable="true"
    >
      <template #clear-icon="{ clear }">
        <CloseIcon @click="clear" />
      </template>
    </Datepicker>
    <Datepicker
      v-model="endDate"
      text-input
      auto-apply
      format="yyyy-MM-dd"
      :enable-time-picker="false"
      :placeholder="$t('global_admin.end_date')"
      :clearable="true"
    >
      <template #clear-icon="{ clear }">
        <CloseIcon @click="clear" />
      </template>
    </Datepicker>

    <div class="enable_sum_for_period_start">
      <input
        type="checkbox"
        class="checkbox"
        v-model="sumForPeriodStartEnabled"
      />
      {{ $t("global_admin.enter_sum_for_distribution_to_employees") }}
    </div>
    <input
      class="input_field"
      v-if="sumForPeriodStartEnabled"
      v-model="thanksSumForPeriodStart"
      :placeholder="$t('global_admin.select_thanks_amount')"
    />
    <button
      @click="createPeriod"
      class="create_button general-brand-bg general-white-color"
    >
      {{ $t("global_admin.create_period") }}
    </button>
  </div>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import CloseIcon from "@/components/Icons/close.vue";
import vSelect from "vue-select";
import axios from "axios";

import { useStore as useGlobalAdminStore } from "@/store/GlobalAdminStore/index.js";
import { mapStores } from "pinia";

import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "PeriodCreationForm",
  components: {
    vSelect,
    Datepicker,
    CloseIcon,
  },
  data() {
    return {
      startDate: null,
      endDate: null,
      selectedOrganization: null,
      sumForPeriodStartEnabled: false,
      thanksSumForPeriodStart: 0,
    };
  },
  computed: {
    ...mapStores(useGlobalAdminStore),
  },
  methods: {
    async createPeriod() {
      try {
        if (!this.selectedOrganization) {
          throw new Error(this.$t("global_admin.select_organization"));
        }
        if (!this.startDate) {
          throw new Error(this.$t("global_admin.select_start_date"));
        }
        if (!this.endDate) {
          throw new Error(this.$t("global_admin.select_end_date"));
        }

        let dataToSend = {
          organization_id: this.selectedOrganization.id,
          start_date: this.startDate.toISOString().slice(0, 10),
          end_date: this.endDate.toISOString().slice(0, 10),
        };

        if (this.sumForPeriodStartEnabled) {
          dataToSend.distr_amount = this.thanksSumForPeriodStart;
        }

        await axios.post(API_URIS.globalPeriods, dataToSend);

        this.globalAdminStore.selectedOrganizationIDForPeriods =
          this.selectedOrganization.id;
        this.globalAdminStore.getPeriods();
        notify(this.$t("global_admin.period_successfully_created"), "success");

        this.selectedOrganization = null;
        this.startDate = null;
        this.endDate = null;
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.period_creation_form {
  display: flex;
  flex-direction: column;
  max-width: 350px;
  gap: 10px;
}
.functionality_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
}
.input_field {
  width: auto;
  border-radius: 12px;
  padding: 13px 16px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid var(--generalColorGrey);
}
.enable_sum_for_period_start {
  display: flex;
  white-space: nowrap;
  align-items: center;
  gap: 10px;
}

.checkbox {
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
  min-width: 20px;
  width: 20px;
  height: 20px;
  background-color: var(--generalColorWhite);
  border-radius: 6px;
  border: 1px solid var(--generalBrandLight);
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

.create_button {
  width: 100%;
  border-radius: 6px;
  padding: 16px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  word-break: break-word;
}
</style>
<style >
.dp__input_wrap > svg {
  display: none;
}
.dp__input_wrap > input::placeholder {
  color: var(--generalContrast) !important;
  font-size: 14px;
}
.dp__input {
  padding: 12px !important;
  border-radius: 12px !important;
  font-size: 14px !important;
  background-color: var(--generalColorWhite) !important;
}
</style>