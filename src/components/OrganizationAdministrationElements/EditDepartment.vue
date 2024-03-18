<template>
  <div class="edit_department_form">
    <h1 class="edit_department_form_title">
      {{ $t("organization.department_settings.editFormTitle") }}
    </h1>
    <div class="edit_department_form_inputs">
      <input
        type="text"
        class="_form_inputs_input"
        :placeholder="$t('organization.department_settings.namePlaceholder')"
        v-model="departmentName"
      />
    </div>
    <div class="edit_department_form_buttons">
      <button class="_form_button _save" @click="saveDepartment">
        {{ $t("employee.employee_actions.save") }}
      </button>
      <button class="_form_button _cancel" @click="cancel">
        {{ $t("employee.employee_actions.cancel") }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "EditDepartmentForm",
  props: {
    department: {
      required: true,
    },
  },
  data() {
    return {
      departmentName: "",
    };
  },
  methods: {
    setInfo() {
      this.departmentName = this.department.name;
    },
    async saveDepartment() {
      try {
        let params = {
          name: this.departmentName,
        };
        await axios.patch(
          `${API_URIS.organizations}${this.department.id}/`,
          params
        );
        notify(
          this.$t(
            "organization.department_settings.notifications.editingComplete"
          ),
          "success"
        );
        this.$emit("departmentEdited");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    cancel() {
      this.$emit("cancelEditing");
    },
  },
  mounted() {
    this.setInfo();
  },
};
</script>

<style scoped>
.edit_department_form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.edit_department_form_title {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
.edit_department_form_inputs {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
._form_inputs_input {
  width: 100%;
  height: 52px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
}
._form_inputs_input::placeholder {
  font-family: "SF Pro Text";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: var(--generalColorSecondary);
}
.edit_department_form_buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
._form_button {
  width: 50%;
  height: 56px;
  border-radius: 6px;
}
._save {
  background-color: var(--generalBrand);
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  color: var(--generalColorWhite);
}
._cancel {
  background-color: var(--secondaryColorBrand);
  font-family: "Roboto";
  font-size: 16px;
  font-weight: 400;
  color: var(--generalBrand);
}
</style>