<template>
  <div class="move_employee_screen_wrapper">
    <div class="move_employee_wrapper">
      <div class="move_employee general-white-bg">
        <h1 class="move_employee_header general-contrast-color">
          {{ $t("employee.employee_actions.move") }}
        </h1>
        <OrganizationSelectList
          @selectOrganization="selectOrganization"
          :organizations="departments"
        />
        <div class="move_or_cancel_buttons">
          <button
            class="move_or_cancel_button general-brand-bg"
            @click="$emit('moveEmployee', employeeData, selectedRolesList, selectedOrganization)"
          >
            <h1 class="move_or_cancel_button_text general-white-color">
              {{ $t("employee.employee_actions.save") }}
            </h1>
          </button>
          <button
            class="move_or_cancel_button brand-secondary-bg"
            @click="$emit('cancelEmployeeMove')"
          >
            <h1 class="move_or_cancel_button_text general-brand-color">
              {{ $t("employee.employee_actions.cancel") }}
            </h1>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";
import OrganizationSelectList from "./OrganizationSelectList.vue";

export default {
  name: "MoveEmployee",
  components: {
    OrganizationSelectList,
  },
  props: {
    orgDetails: {
      required: true,
    },
    employee: {
      required: true
    }
  },
  data() {
    return {
      departments: [],
      rolesList: [],
      selectedRolesList: [],
      selectedOrganization: null,
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
    this.getDepartments();
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
    selectOrganization(organization) {
      this.selectedOrganization = organization;
    },
    async getDepartments() {
      try {
        const response = await axios.post(API_URIS.getOrganizationDepartments, {
          organization_id: this.orgDetails.top_id,
        });
        this.departments = response.data;
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
.move_employee_screen_wrapper {
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
.move_employee_wrapper {
  max-width: 477px;
  width: 100%;
  position: relative;
  margin-top: 50px;
  margin-bottom: 50px;
  left: 50%;
  transform: translate(-50%);
  z-index: 2;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
}
.move_employee {
  position: relative;
  padding: 32px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.move_employee_header {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
  text-align: left;
}
.move_or_cancel_buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.move_or_cancel_button {
  border-radius: 6px;
  padding: 16px 24px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.move_or_cancel_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>