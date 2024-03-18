<template>
  <div class="delete_department_form">
    <h1 class="delete_department_form_title">
      {{ $t("organization.department_settings.deleteFormTitle") }}
    </h1>
    <div class="delete_department_form_buttons">
      <button class="_form_button _save" @click="deleteDepartment">
        {{ $t("common_components.employee_edit_menu.delete") }}
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
  name: "DeleteDepartmentForm",
  props: {
    department: {
      required: true,
    },
  },
  methods: {
    async deleteDepartment() {
      try {
        await axios.delete(`${API_URIS.organizations}${this.department.id}/`);
        notify(
          this.$t(
            "organization.department_settings.notifications.deletingComplete"
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
      this.$emit("cancelDeleting");
    },
  },
};
</script>

<style scoped>
.delete_department_form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.delete_department_form_title {
  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
.delete_department_form_buttons {
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