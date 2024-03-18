<template>
  <div class="employee_creation_form">
    <h1 class="functionality_header">
      {{ $t("global_admin.employee_creation") }}
    </h1>
    <EmployeeCreationFields 
      @employeeDataChanged="employeeDataChanged"
      :fieldsToRemove="fieldsToRemove"
    />
    <button
      class="create_button general-brand-bg general-white-color"
      @click="createEmployee"
    >
      {{ $t("global_admin.create_employee") }}
    </button>
  </div>
</template>

<script>
import axios from "axios";

import EmployeeCreationFields from "@/common-components/employee-creation-form/EmployeeCreationFields.vue";
import { API_URIS } from "@/constants/api";
import { notify } from "@/general-scripts/toast-notification";

export default {
  name: "OrganizationCreationForm",
  components: {
    EmployeeCreationFields,
  },
  data() {
    return {
      formData: null,
      // fieldsToRemove: ["department_id", "email", "phone_number"],
      fieldsToRemove: []
    };
  },
  methods: {
    employeeDataChanged(formData) {
      this.formData = Object.assign({}, formData);
    },
    removeWhiteSpaceAttributes(obj) {
      for (const key in obj) {
        if (typeof obj[key] === 'string' && obj[key].trim() === '') {
          delete obj[key];
        }
      }
    },
    async createEmployee(){
      try {   
        if (this.formData.organization_id) this.formData.organization_id = this.formData.organization_id.id;
        if (this.formData.department_id) this.formData.department_id = this.formData.department_id.id;
        if (this.formData.gender) this.formData.gender = this.formData.gender.gender;
        if (this.formData.status) this.formData.status = this.formData.status.status;
        if (this.formData.role) this.formData.role = this.formData.role.role;
        if (this.formData.hired_at) this.formData.hired_at = this.formData.hired_at.toISOString().slice(0, 10);
        if (this.formData.date_of_birth) this.formData.date_of_birth = this.formData.date_of_birth.toISOString().slice(0, 10);
        this.removeWhiteSpaceAttributes(this.formData);

        let phone_number = this.formData.phone_number;
        let email = this.formData.email;
        delete this.formData.phone_number;
        delete this.formData.email;

        let contacts = [];

        if (email){
          contacts.push({
            contact_type: "@",
            contact_id: email,
          });
        }
        if (phone_number){
          contacts.push({
            contact_type: "P",
            contact_id: phone_number
          })
        }
        
        await axios.post(API_URIS.createEmployee, this.formData);
        if (contacts.length > 0) await axios.post(API_URIS.createFewContacts, contacts);
        notify(this.$t("global_admin.employee_successfully_created"), "success");
      } catch(err) {
        notify(err?.response?.data || this.$t("notification.error"));
        throw err;
      } 
    }
  },
};
</script>

<style scoped>
.employee_creation_form {
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
</style>
