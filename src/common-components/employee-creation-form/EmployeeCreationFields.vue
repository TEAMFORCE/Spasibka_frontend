<template>
  <div class="employee_creation_fields">
    <div class="employee_field" v-for="field in filteredEmployeeFields">
      <component
        text-input
        auto-apply
        :is="field.type"
        :options="fieldOptions[field.fieldName]"
        :placeholder="field.textName"
        :label="field.label"
        :enable-time-picker="false"
        :clearable="true"
        format="dd-MM-yyyy"
        class="employee_field_input"
        v-model="formData[field.fieldName]"
        @input="updateFormData(field.fieldName, $event)"
      />
    </div>
  </div>
</template>

<script>
import { employeeFields } from "./employee-creation-fields.js";

import vSelect from "vue-select";
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { useStore as useProfileStore } from "@/store/profile";
import { useStore as useGlobalAdminStore } from "@/store/GlobalAdminStore/index.js";
import { mapStores } from "pinia";

export default {
  name: "EmployeeCreationFields",
  props: {
    fieldsToRemove: {
      default: [],
    },
  },
  components: {
    vSelect,
  },
  data() {
    return {
      formData: {},
      fieldOptions: {},

      organizations: [],
      selectedOrganizationID: null,
    };
  },
  mounted() {
    this.determineOptions();
    this.getOrganizations();
  },
  computed: {
    ...mapStores(useProfileStore),
    ...mapStores(useGlobalAdminStore),
    filteredEmployeeFields() {
      return employeeFields.filter(
        (obj) => !this.fieldsToRemove.includes(obj["fieldName"])
      );
    },
  },
  watch: {
    formData: {
      handler() {
        this.$emit("employeeDataChanged", this.formData);
      },
      deep: true,
    },
    "formData.organization_id": {
      handler(newValue) {
        if (newValue) {
          this.selectedOrganizationID = newValue.id;
          this.getDepartments();
        } else {
          this.fieldOptions.department_id = [];
        }
      },
    },
    "globalAdminStore.organizationsList": {
      handler(newValue) {
        this.fieldOptions.organization_id = newValue;
      },
      deep: true,
    },
  },
  methods: {
    updateFormData(fieldName, event) {
      this.formData[fieldName] = event.target.value;
    },
    async getDepartments() {
      try {
        const response = await axios.post(API_URIS.getOrganizationDepartments, {
          organization_id: this.selectedOrganizationID,
        });
        this.fieldOptions.department_id = response.data;
      } catch (err) {
        throw err;
      }
    },
    async getOrganizations() {
      try {
        this.globalAdminStore.getOrganizations();
      } catch (err) {
        throw err;
      }
    },
    async determineOptions() {
      for (const field of this.filteredEmployeeFields) {
        if (typeof field.options === "function") {
          this.fieldOptions[field.fieldName] = field.options(this);
        }
      }
    },
  },
};
</script>

<style scoped>
.employee_creation_fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  width: calc(100% - 34px);
  border-radius: 12px;
  padding: 13px 16px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid var(--generalColorGrey);
}
</style>
