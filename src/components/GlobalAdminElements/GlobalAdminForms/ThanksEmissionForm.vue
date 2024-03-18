<template>
  <div class="thanks_emission_form">
    <h1 class="functionality_header">
      {{ $t("global_admin.thanks_emission") }}
    </h1>
    <vSelect
      v-model="selectedOrganization"
      :options="globalAdminStore?.organizationsList"
      :placeholder="$t('global_admin.select_organization')"
      label="name"
    />
    <div class="send_to_employee_checkbox">
      <input type="checkbox" class="checkbox" v-model="sendToEmployee"/>
      {{ $t("global_admin.send_to_employee") }}
    </div>
    <vSelect
      v-if="sendToEmployee"
      v-model="selectedEmployee"
      :options="employeesList"
      :placeholder="$t('global_admin.select_employee')"
      label="displayName"
    />
    <input
      class="input_field"
      :placeholder="$t('global_admin.enter_thanks_amount')"
      v-model="amount"
    />
    <button
      class="create_button general-brand-bg general-white-color"
      @click="emitThanks"
    >
      {{ $t("global_admin.emit_thanks") }}
    </button>
  </div>
</template>

<script>
import vSelect from "vue-select";
import axios from "axios";

import { mapStores } from "pinia";
import { useStore as useGlobalAdminStore } from "@/store/GlobalAdminStore/index.js";

import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "ThanksEmissionForm",
  components: {
    vSelect
  },
  data(){
    return {
      selectedOrganization: null,
      selectedEmployee: null,

      employeesList: [],

      amount: null,
      sendToEmployee: false,
    }
  },
  computed: {
    ...mapStores(useGlobalAdminStore),
  },
  watch: {
    selectedOrganization: {
      handler(){
        this.getEmployees();
      },
      immediate: true
    }
  },
  methods: {
    async getEmployees(){
      if (!this.selectedOrganization) return;
      try {
        const response = await axios.get(API_URIS.employees, {
          params: {
            organization_id: this.selectedOrganization.id,
            offset: 1,
            limit: 99999
          }
        });
        this.employeesList = response.data;
        this.employeesList.map(employee => {
          const { tg_name, first_name, surname, nickname } = employee;
          let displayName = "";
          if (surname || first_name) {
            displayName = `${surname || ""} ${first_name || ""}`.trim();
          } else if (tg_name) {
            displayName = "@" + tg_name;
          } else {
            displayName = "@" + nickname || "";
          }
          employee.displayName = displayName;
        });
      } catch(err) {
        throw err;
      }
    },
    async emitThanks(){
      try {
        if (!this.amount){
          throw new Error(this.$t("global_admin.select_thanks_amount"));
        }
        if (!this.selectedEmployee && !this.selectedOrganization){
          throw new Error(this.$t("global_admin.select_organization_or_employee"));
        }
        await axios.post(API_URIS.globalSendCoins, {
          amount: this.amount,
          ...(this.sendToEmployee ? { employee_id: this.selectedEmployee.id } : { organization_id: this.selectedOrganization.id })
        })
        this.selectedOrganization = null;
        this.employeesList = [];
        this.selectedEmployee = null;
        this.amount = null;
        notify(this.$t("global_admin.thanks_successfully_emitted"), "success");
      } catch(err) {
        notify(err?.response?.data || err?.message || this.$t("notification.error"));
        throw err;
      }
    }
  }
}
</script>

<style scoped>
.thanks_emission_form {
  max-width: 350px;
  display: flex;
  gap: 10px;
  flex-direction: column;
}
.functionality_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
}
.create_button {
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
.send_to_employee_checkbox {
  display: flex;
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
</style>