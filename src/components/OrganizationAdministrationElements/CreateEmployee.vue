<template>
  <div class="create_employee_screen_wrapper">
    <div class="create_employee_wrapper">
      <div class="create_employee general-white-bg">
        <h1 class="create_employee_text general-contrast-color">
          {{ $t("employee.employee_create.title") }}
        </h1>
        <h5 class="create_notice">
          {{ $t("employee.employee_create.description") }}
          <span class="create_notice_attention">
            "{{ $t("employee.employee_create.telegramNickname") }}"
          </span>
          "{{ $t("employee.employee_create.and") }}"
          <span class="create_notice_attention">
            "{{ $t("employee.employee_create.telegramId") }}"
          </span>
          "{{ $t("employee.employee_create.or") }}"
          <span class="create_notice_attention">
            "{{ $t("employee.employee_create.email") }}"
          </span>
          "{{ $t("employee.employee_create.and") }}"
          <span class="create_notice_attention">
            "{{ $t("employee.employee_create.nickname") }}"
          </span>
        </h5>
        <div class="input_field_wrapper">
          <div
            v-if="department"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.division") }}
          </div>
          <vSelect
            v-model="department"
            :options="departmentsList"
            :placeholder="$t('employee.employee_create.division')"
            label="name"
            @option:selected="changeOrganization"
          />
        </div>
        <h1
          v-if="employeeCreationError?.department_id"
          class="employee_creation_error general-brand-color"
        >
          {{ employeeCreationError.department_id }}
        </h1>
        <div class="input_field_wrapper">
          <div
            v-if="telegramName"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.telegramNickname") }}
          </div>
          <input
            class="employee_name general-contrast-color"
            v-model="telegramName"
            :placeholder="$t('employee.employee_create.telegramNickname')"
            :class="{ error: tgNameError }"
          />
        </div>
        <h5 v-if="tgNameError" class="field_error">
          {{ $t("employee.errors.requredField") }}
        </h5>
        <div class="input_field_wrapper">
          <div
            v-if="telegramID"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.telegramId") }}
          </div>
          <input
            class="employee_name general-contrast-color"
            v-model="telegramID"
            :placeholder="$t('employee.employee_create.telegramId')"
            :class="{ error: tgIdError }"
          />
        </div>
        <h5 v-if="tgIdError" class="field_error">
          {{ $t("employee.errors.requredField") }}
        </h5>
        <div class="input_field_wrapper">
          <div
            v-if="surname"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.lastName") }}
          </div>
          <input
            class="employee_name general-contrast-color"
            v-model="surname"
            :placeholder="$t('employee.employee_create.lastName')"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="firstName"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.firstName") }}
          </div>
          <input
            class="employee_name general-contrast-color"
            v-model="firstName"
            :placeholder="$t('employee.employee_create.firstName')"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="middleName"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.middleName") }}
          </div>
          <input
            class="employee_name general-contrast-color"
            v-model="middleName"
            :placeholder="$t('employee.employee_create.middleName')"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="nickname"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.nickname") }}
          </div>
          <input
            class="employee_name general-contrast-color"
            v-model="nickname"
            :placeholder="$t('employee.employee_create.nickname')"
            :class="{ error: nicknameError }"
          />
        </div>
        <h5 v-if="nicknameError" class="field_error">
          {{ $t("employee.errors.requredField") }}
        </h5>
        <div class="input_field_wrapper">
          <div
            v-if="gender"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.gender") }}
          </div>
          <vSelect
            v-model="gender"
            :options="employeeGenders"
            :placeholder="$t('employee.employee_create.gender')"
            label="title"
            @option:selected="changeGender"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="status"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.status") }}
          </div>
          <vSelect
            v-model="status"
            :options="employeeStatuses"
            :placeholder="$t('employee.employee_create.status')"
            label="title"
            @option:selected="changeStatus"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="hiredAt"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.startWorkTime") }}
          </div>
          <Datepicker
            class="challenge_date_picker"
            v-model="hiredAt"
            text-input
            auto-apply
            format="dd.MM.yyyy"
            locale="ru"
            position="left"
            :enable-time-picker="false"
            :placeholder="$t('employee.employee_create.startWorkTime')"
            @update:model-value="setDate"
          >
            <template #clear-icon="{ clear }">
              <CloseIcon @click="clear" />
            </template>
          </Datepicker>
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="date_of_birth"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.birthday") }}
          </div>
          <Datepicker
            class="challenge_date_picker"
            v-model="date_of_birth"
            text-input
            auto-apply
            format="dd.MM.yyyy"
            locale="ru"
            position="left"
            :enable-time-picker="false"
            :placeholder="$t('employee.employee_create.birthday')"
            @update:model-value="setBirthDate"
          >
            <template #clear-icon="{ clear }">
              <CloseIcon @click="clear" />
            </template>
          </Datepicker>
        </div>
        <h1
          v-if="employeeCreationError?.hiredAt"
          class="employee_creation_error general-brand-color"
        >
          {{ employeeCreationError.hiredAt }}
        </h1>
        <div class="input_field_wrapper">
          <div
            v-if="email"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.email") }}
          </div>
          <input
            class="employee_name general-contrast-color"
            v-model="email"
            :placeholder="$t('employee.employee_create.email')"
            :class="{ error: emailError }"
          />
        </div>
        <h5 v-if="emailError" class="field_error">
          {{ $t("employee.errors.requredField") }}
        </h5>
        <h1
          v-if="employeeCreationError?.email"
          class="employee_creation_error general-brand-color"
        >
          {{ employeeCreationError.email }}
        </h1>
        <div class="input_field_wrapper">
          <div
            v-if="phoneNumber"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.phone") }}
          </div>
          <input
            class="employee_name general-contrast-color"
            v-model="phoneNumber"
            :placeholder="$t('employee.employee_create.phone')"
          />
        </div>
        <div class="input_field_wrapper">
          <div
            v-if="jobTitle"
            class="input_field_placeholder general-secondary-color general-white-bg"
          >
            {{ $t("employee.employee_create.jobTitle") }}
          </div>
          <input
            class="employee_name general-contrast-color"
            v-model="jobTitle"
            :placeholder="$t('employee.employee_create.jobTitle')"
          />
        </div>
        <div class="create_or_cancel_buttons">
          <button
            class="create_or_cancel_button general-brand-bg"
            @click="createEmployee"
          >
            <h1 class="create_or_cancel_button_text general-white-color">
              {{ $t("employee.employee_create.create") }}
            </h1>
          </button>
          <button
            class="create_or_cancel_button brand-secondary-bg"
            @click="$emit('cancelEmployeeCreation')"
          >
            <h1 class="create_or_cancel_button_text general-brand-color">
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

import Datepicker from "@vuepic/vue-datepicker";
import vSelect from "vue-select";
import CloseIcon from "@/components/Icons/close.vue";

import { EMPLOYEE_STATUSES } from "@/infrastructure/data-sources/employee-statuses";
import { EMPLOYEE_GENDERS } from "@/infrastructure/data-sources/employee-genders";

export default {
  name: "CreateEmployee",
  components: {
    Datepicker,
    vSelect,
    CloseIcon,
  },
  props: {
    employeeCreationError: {
      required: true,
    },
  },
  data() {
    return {
      tgNameError: false,
      tgIdError: false,
      nicknameError: false,
      emailError: false,

      telegramName: "",
      telegramID: "",
      surname: "",
      firstName: "",
      middleName: "",
      nickname: "",
      hiredAt: "",
      date_of_birth: "",
      email: "",
      phoneNumber: "",
      jobTitle: "",
      status: null,
      gender: null,
      department: null,
      departmentId: null,

      formValid: false,

      departmentsList: [],
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore.profileInfo;
    },
    employeeStatuses() {
      return EMPLOYEE_STATUSES(this);
    },
    employeeGenders() {
      return EMPLOYEE_GENDERS(this);
    },
  },
  methods: {
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
    changeOrganization(department) {
      this.departmentId = department.id;
    },
    changeStatus(status) {
      this.status = status;
    },
    changeGender(gender) {
      this.gender = gender;
    },
    setDate() {
      this.hiredAt = this.hiredAt.toISOString().slice(0, 10);
    },
    setBirthDate() {
      this.date_of_birth = this.date_of_birth.toISOString().slice(0, 10);
    },
    isValid() {
      if (
        (this.telegramName !== "" && this.telegramID !== "") ||
        (this.nickname !== "" && this.email !== "")
      ) {
        this.tgNameError = false;
        this.tgIdError = false;
        this.nicknameError = false;
        this.emailError = false;
        return true;
      }
      if (
        this.telegramID == "" ||
        this.telegramName == "" ||
        this.nickname == "" ||
        this.email == ""
      ) {
        this.tgNameError = !this.telegramName;
        this.tgIdError = !this.telegramID;
        this.nicknameError = !this.nickname;
        this.emailError = !this.email;
        return false;
      }
    },
    createEmployee() {
      if (this.isValid()) {
        let employeeData = {
          telegramName: this.telegramName,
          telegramID: this.telegramID,
          surname: this.surname,
          firstName: this.firstName,
          middleName: this.middleName,
          nickname: this.nickname,
          job_title: this.jobTitle,
          gender: this.gender?.gender,
          status: this.status?.status,
          hiredAt: this.hiredAt,
          date_of_birth: this.date_of_birth,
          email: this.email,
          phoneNumber: this.phoneNumber,
          departmentId: this.departmentId,
        };
        this.$emit("createEmployee", employeeData);
      }
    },
  },
  mounted() {
    this.getOrganizations(this.profileInfo.profile.organization_id);
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");

.create_employee_screen_wrapper {
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
.create_employee_wrapper {
  position: relative;
  margin-top: 50px;
  max-width: 477px;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
}
.create_employee {
  padding: 32px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.create_employee_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
.create_notice {
  font-family: "Ubuntu";
  font-weight: 400;
  font-size: 12px;
  text-align: left;
  line-height: 16px;
  margin: 0;
}

.create_notice_attention {
  color: var(--generalBrand);
}
.input_field_wrapper {
  position: relative;
  width: 100%;
}
.input_field_placeholder {
  z-index: 3;
  padding-left: 4px;
  padding-right: 4px;
  position: absolute;
  left: 15px;
  top: -9px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.employee_name {
  box-sizing: border-box;
  width: 100%;
  border-radius: 12px;
  padding: 13px 16px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid var(--generalColorGrey);
  background-color: var(--generalColorWhite);
}
.employee_name:focus {
  outline: none;
}
.employee_name::placeholder {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--generalColorSecondary);
}
.error {
  border: 1px solid var(--minorError);
}
.field_error {
  margin: -16px 0 0 6px;
  text-align: left;
  color: var(--minorError);
}
.employee_creation_error {
  margin-top: -20px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
}
.create_or_cancel_buttons {
  display: flex;
  gap: 12px;
}
.create_or_cancel_button {
  border-radius: 6px;
  padding: 16px 24px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.create_or_cancel_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  word-break: break-word;
}
@media (max-width: 1000px) {
  .create_employee {
    margin: 0 0 120px 0;
  }
}
</style> 