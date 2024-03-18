<template>
  <div class="edit_employee_screen_wrapper">
    <div class="edit_employee_wrapper">
      <div class="edit_employee general-white-bg">
        <h1 class="edit_employee_text general-contrast-color">
          {{ $t("employee.employee_create.edit_employee") }}
        </h1>
        <div class="input_field_wrapper">
          <div
            v-if="selectedRolesList.length"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("organization.roles") }}
          </div>
          <vSelect
            v-model="selectedRolesList"
            :options="rolesList"
            :placeholder="$t('organization.roles')"
            taggable
            multiple
            label="role_name"
            @option:selected="deleteRoleFromList"
            @option:deselected="addRoleToList"
          />
        </div>
        <div class="employee_edit_field" v-for="item in employeeData">
          <div class="input_field_header general-white-bg" v-if="item.vModel">
            <h1 class="input_field_header_text general-secondary-color">
              {{ item.placeholder }}
            </h1>
          </div>
          <Datepicker
            v-if="item.date"
            v-model="item.vModel"
            class="challenge_date_picker"
            text-input
            auto-apply
            format="dd.MM.yyyy"
            locale="ru"
            position="left"
            :placeholder="item.placeholder"
            :enable-time-picker="false"
            @update:model-value="setDate(item)"
          >
            <template #clear-icon="{ clear }">
              <CloseIcon @click="clear" />
            </template>
          </Datepicker>
          <vSelect
            v-if="item.select"
            v-model="selectedStatus"
            :options="employeeStatuses"
            :placeholder="item.placeholder"
            label="title"
            @option:selected="changeStatus"
          />
          <vSelect
            v-if="item.department"
            v-model="selectedDepartment"
            :options="departmentsList"
            :placeholder="item.placeholder"
            label="name"
            @option:selected="changeDepartment"
          />
          <vSelect
            v-if="item.dataHeader == 'gender'"
            v-model="selectedGender"
            :options="employeeGenders"
            :placeholder="item.placeholder"
            label="title"
            @option:selected="changeGender"
          />
          <input
            class="employee_data_input general-contrast-color"
            v-model="item.vModel"
            :placeholder="item.placeholder"
            v-if="
              !item.date &&
              !item.select &&
              !item.department &&
              item.dataHeader != 'gender'
            "
          />
        </div>
        <div class="edit_or_cancel_buttons">
          <button
            class="edit_or_cancel_button general-brand-bg"
            @click="$emit('editEmployee', employeeData, selectedRolesList)"
          >
            <h1 class="edit_or_cancel_button_text general-white-color">
              {{ $t("employee.employee_create.save") }}
            </h1>
          </button>
          <button
            class="edit_or_cancel_button brand-secondary-bg"
            @click="$emit('cancelEmployeeEdit')"
          >
            <h1 class="edit_or_cancel_button_text general-brand-color">
              {{ $t("employee.employee_create.cancel") }}
            </h1>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";
import { EMPLOYEE_STATUSES } from "@/infrastructure/data-sources/employee-statuses";
import { EMPLOYEE_GENDERS } from "@/infrastructure/data-sources/employee-genders";

import vSelect from "vue-select";
import Datepicker from "@vuepic/vue-datepicker";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "EditEmployee",
  components: {
    vSelect,
    Datepicker,
    CloseIcon,
  },
  props: {
    employee: {
      required: true,
    },
    employeeEditionError: {
      required: true,
    },
  },
  data() {
    return {
      selectedStatus: null,
      selectedGender: null,
      selectedDepartment: null,
      rolesList: [],
      selectedRolesList: [],
      departmentsList: [],
      employeeData: [
        {
          vModel: this.employee.department_id,
          placeholder: this.$t("employee.employee_create.division"),
          dataHeader: "department_id",
          department: true,
          select: false,
        },
        {
          vModel: this.employee.tg_name,
          placeholder: this.$t("employee.employee_create.telegramNickname"),
          dataHeader: "tg_name",
        },
        {
          vModel: this.employee.tg_id,
          placeholder: this.$t("employee.employee_create.telegramId"),
          dataHeader: "tg_id",
        },

        {
          vModel: this.employee.surname,
          placeholder: this.$t("employee.employee_create.lastName"),
          dataHeader: "surname",
        },
        {
          vModel: this.employee.first_name,
          placeholder: this.$t("employee.employee_create.firstName"),
          dataHeader: "first_name",
        },
        {
          vModel: this.employee.middle_name,
          placeholder: this.$t("employee.employee_create.middleName"),
          dataHeader: "middle_name",
        },

        {
          vModel: this.employee.nickname,
          placeholder: this.$t("employee.employee_create.nickname"),
          dataHeader: "nickname",
        },
        {
          vModel: this.employee.gender,
          placeholder: this.$t("employee.employee_create.gender"),
          dataHeader: "gender",
        },
        {
          vModel: this.employee.status,
          placeholder: this.$t("employee.employee_create.status"),
          dataHeader: "status",
          select: true,
        },
        {
          vModel: this.employee.hired_at,
          placeholder: this.$t("employee.employee_create.startWorkTime"),
          dataHeader: "hired_at",
          date: true,
        },
        {
          vModel: this.employee.date_of_birth,
          placeholder: this.$t("employee.employee_create.birthday"),
          dataHeader: "date_of_birth",
          date: true,
        },
        {
          vModel: this.employee.fired_at,
          placeholder: this.$t("employee.employee_create.fireDate"),
          dataHeader: "fired_at",
          date: true,
        },
        {
          vModel: this.employee.email,
          placeholder: this.$t("employee.employee_create.email"),
          dataHeader: "email",
        },
        {
          vModel: this.employee.mobile_number,
          placeholder: this.$t("employee.employee_create.phone"),
          dataHeader: "mobile_number",
        },
        {
          vModel: this.employee.vk_id,
          placeholder: "VK ID",
          dataHeader: "vk_id",
        },
        {
          vModel: this.employee.job_title,
          placeholder: this.$t("employee.employee_create.jobTitle"),
          dataHeader: "job_title",
        },
      ],
    };
  },
  mounted() {
    this.getRolesList();
    this.getSelectedStatus();
    this.getSelectedGender();
    this.getOrganizations(this.profileInfo.profile.organization_id);
    setTimeout(() => {
      this.getSelectedDepartment();
    }, 300);
  },
  computed: {
    employeeStatuses() {
      return EMPLOYEE_STATUSES(this);
    },
    employeeGenders() {
      return EMPLOYEE_GENDERS(this);
    },
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore.profileInfo;
    },
  },
  methods: {
    async getRolesList() {
      try {
        const response = await axios.get(API_URIS.userroles);
        this.rolesList = Object.keys(response.data.data).map((key) => {
          return { role: key, role_name: response.data.data[key] };
        });
        const userProfileInfo = await axios.get(
          API_URIS.otherProfile + this.employee.id + "/"
        );
        const userRoles = userProfileInfo.data.privileged;
        for (let i = 0; i < userRoles?.length; ++i) {
          this.deleteRoleFromList(userRoles[i]);
          this.selectedRolesList.push(userRoles[i]);
        }
      } catch (err) {
        throw err;
      }
    },
    addRoleToList(arg) {
      this.rolesList.push(arg);
    },
    deleteRoleFromList(arg) {
      this.rolesList = this.rolesList.filter((el) => {
        if (arg?.length && arg.length > 0) {
          let foundElementInArray = false;
          for (let i = 0; i < arg.length; ++i) {
            if (arg[i].role === el.role) {
              foundElementInArray = true;
              break;
            }
          }
          return !foundElementInArray;
        } else if (arg?.role) {
          return el.role !== arg.role;
        } else {
          return true;
        }
      });
    },
    async getOrganizations(organizationId) {
      try {
        let response = await axios.post(API_URIS.getOrganizationDepartments, {
          organization_id: organizationId,
        });
        this.departmentsList = response.data;
      } catch (error) {
        throw error;
      }
    },
    setDate(item) {
      this.employeeData.find((el) => el.dataHeader == item.dataHeader).vModel =
        item.vModel.toISOString().slice(0, 10);
    },
    getSelectedStatus() {
      if (this.employee.status) {
        this.selectedStatus = this.employeeStatuses.find(
          (el) => el.status === this.employee.status
        ).title;
      } else {
        return;
      }
    },
    getSelectedGender() {
      if (this.employee.gender) {
        this.selectedGender = this.employeeGenders.find(
          (el) => el.gender === this.employee.gender
        ).title;
      }
    },
    getSelectedDepartment() {
      if (this.employee.department_id) {
        this.selectedDepartment = this.departmentsList.find(
          (el) => el.id == this.employee.department_id
        );
      } else {
        return;
      }
    },
    setSelectedLabel(status) {
      if (status) {
        let statusFromDataSource = this.employeeStatuses.find(
          (el) => el.status == status
        );
        return statusFromDataSource.status;
      }
    },
    changeStatus(status) {
      this.employeeData.find((el) => el.dataHeader == "status").vModel =
        status.status;
    },
    changeGender(gender) {
      this.employeeData.find((el) => el.dataHeader == "gender").vModel =
        gender.gender;
    },
    changeDepartment(department) {
      this.employeeData.find((el) => el.dataHeader == "department_id").vModel =
        department.id;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");

.vs__dropdown-toggle {
  padding: 7px !important;
  height: 48px;
}
.vs__selected {
  font-size: 14px !important;
  font-family: "SF Pro Text" !important;
  font-style: normal !important;
  font-weight: 400 !important;
}
.dp__main {
  width: 100% !important;
}
.edit_employee_screen_wrapper {
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
.edit_employee_screen_wrapper::-webkit-scrollbar {
  width: 8px;
}
.edit_employee_screen_wrapper::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.edit_employee_wrapper {
  max-width: 477px;
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
}
.edit_employee {
  padding: 32px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.edit_employee_text {
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
.employee_edit_field {
  position: relative;
  display: flex;
  gap: 20px;
}

.input_field_header {
  position: absolute;
  padding: 0px 2px;
  top: -5px;
  left: 15px;
  z-index: 1;
}
.input_field_header_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  z-index: 6;
}

.add_key {
  height: 48px;
  width: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add_key_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.employee_data_input {
  background-color: var(--generalColorWhite);
  width: 100%;
  border-radius: 12px;
  padding: 13px 16px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid var(--generalColorGrey);
}
.employee_data_input:focus {
  outline: none;
}
.employee_data_input:disabled {
  background-color: var(--generalColorGrey);
}
.employee_edition_error {
  margin-top: -20px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
}
.edit_or_cancel_buttons {
  display: flex;
  gap: 12px;
}
.edit_or_cancel_button {
  border-radius: 6px;
  padding: 16px 24px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.edit_or_cancel_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  word-break: break-word;
}
</style> 