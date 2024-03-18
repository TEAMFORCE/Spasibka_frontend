<template>
  <div class="organization_employee general-white-bg" @click.self="goToProfile">
    <FireEmployee
      v-if="employeeFireEnabled"
      @cancelEmployeeFire="cancelEmployeeFire"
      @fireEmployee="fireEmployee"
    />
    <DeleteEmployee
      v-if="employeeDeleteEnabled"
      @cancelEmployeeDelete="cancelEmployeeDelete"
      @deleteEmployee="deleteEmployee"
    />
    <MoveEmployee
      v-if="employeeMoveEnabled"
      @cancelEmployeeMove="cancelEmployeeMove"
      @moveEmployee="moveEmployee"
      :orgDetails="orgDetails"
      :employee="employee"
    />
    <EditEmployee
      v-if="employeeEditEnabled"
      @cancelEmployeeEdit="cancelEmployeeEdit"
      @editEmployee="editEmployee"
      :employeeEditionError="employeeEditionError"
      :employee="employee"
    />
    <div class="employee_top_info" @click.self="goToProfile">
      <div class="avatar_and_options" @click.self="goToProfile">
        <Avatar
          :type="'employee'"
          :userID="employee?.id"
          :userName="employee?.first_name"
          :userSurname="employee?.surname"
          :userPhoto="employee?.photo"
          @click.self="goToProfile"
        />
        <button
          class="employee_options transparent-bg"
          @click.prevent="openOrCloseEmployeeOptionsMenu"
        >
          <RoundMenyBtnIcon />
          <div
            class="employee_options_menu transparent-bg"
            v-if="employeeOptionsMenuEnabled"
            v-click-outside="openOrCloseEmployeeOptionsMenu"
          >
            <button
              class="employee_options_menu_item bottom_bordered general-white-bg"
              v-for="item in employeeActions"
              @click="item.event"
            >
              <component
                :is="{ ...item.icon }"
                :currentColor="getIconColor()"
              />
              <h1 class="employee_option_menu_item_text general-contrast-color">
                {{ item.action }}
              </h1>
            </button>
          </div>
        </button>
      </div>
      <div class="employee_name_and_job" @click="goToProfile">
        <h1 class="employee_name general-dark-color">
          {{ employeeDisplayName }}
        </h1>
        <h1 v-if="employee?.job_title" class="employee_job second-colo-color">
          {{ employee.job_title }}
        </h1>
      </div>
    </div>
    <div class="employee_details" @click="goToProfile">
      <div class="employee_detail" v-for="item in sortedContacts">
        <h1 class="detail_header general-secondary-color">
          {{ header(item) }}
        </h1>
        <h1 class="detail_value general-contrast-color">{{ item.value }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { API_URIS, SERVER_IP } from "@/constants/api";
import FireEmployee from "./FireEmployee.vue";
import MoveEmployee from "./MoveEmployee.vue";
import EditEmployee from "./EditEmployee.vue";
import DeleteEmployee from "./DeleteEmployee.vue";
import axios from "axios";
import Avatar from "@/widgets/Avatar.vue";

import RoundMenyBtnIcon from "@/components/Icons/roundMenuBtn.vue";
import BrandingIcon from "@/components/Icons/branding.vue";
import DeleteIcon from "@/components/Icons/delete.vue";
import CloseIcon from "@/components/Icons/close.vue";
import ReplaceIcon from "@/components/Icons/replace.vue";

export default {
  name: "OrganizationEmployee",
  props: {
    employee: {
      required: true,
    },
    orgDetails: {
      required: true,
    },
    stateUpdate: {
      required: true,
    },
  },
  components: {
    FireEmployee,
    MoveEmployee,
    EditEmployee,
    DeleteEmployee,
    Avatar,
    RoundMenyBtnIcon,
    BrandingIcon,
    DeleteIcon,
    CloseIcon,
    ReplaceIcon,
  },
  data() {
    return {
      employeeOptionsMenuEnabled: false,
      employeeFireEnabled: false,
      employeeMoveEnabled: false,
      employeeEditEnabled: false,
      employeeDeleteEnabled: false,

      mobileNumberContactID: null,
      emailContactID: null,

      employeeEditionError: {
        date_of_birth: null,
        fired_at: null,
        hired_at: null,
        status: null,
        timezone: null,
      },

      employeeActions: [
        {
          action: this.$t("common_components.employee_edit_menu.edit"),
          event: this.openOrCloseEmployeeEditOption,
          icon: BrandingIcon,
        },
        {
          action: this.$t("common_components.employee_edit_menu.move"),
          event: this.openOrCloseEmployeeMoveOption,
          icon: ReplaceIcon,
        },
        {
          action: this.$t("common_components.employee_edit_menu.fire"),
          event: this.openOrCloseEmployeeFireOption,
          icon: CloseIcon,
        },
        // {
        //   action: this.$t("common_components.employee_edit_menu.block"),
        //   event: this.openOrCloseEmployeeDeleteOption,
        //   icon: DeleteIcon,
        // },
      ],
    };
  },
  mounted() {
    this.getContacts();
  },
  watch: {
    stateUpdate() {
      this.getContacts();
    },
  },
  computed: {
    sortedContacts() {
      let sortedContactsArray = this.employee?.contacts;
      sortedContactsArray.sort(
        (a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0)
      );
      return sortedContactsArray;
    },
    employeeDisplayName() {
      let displayName = "";
      if (this.employee?.surname) {
        displayName = this.employee.surname;
      }
      if (this.employee?.first_name) {
        if (displayName) displayName += " ";
        displayName += this.employee.first_name;
      }
      if (this.employee?.middle_name) {
        if (displayName) displayName += " ";
        displayName += this.employee.middle_name;
      }
      if (!this.employee?.first_name) {
        displayName = this.employee.nickname;
      }
      return displayName;
    },
  },
  methods: {
    getIconColor() {
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      return generalContrast;
    },
    goToProfile() {
      this.$router.push("/other_profile/" + this.employee.id);
    },

    getImgUrl(imageName) {
      var images = require.context(
        "@/assets/OrganizationAdministrationImages",
        false,
        /\.png$/
      );
      return images("./" + imageName + ".png");
    },
    photoAddress(photo) {
      if (photo == null) {
        let images = require.context("@/assets/", false, /\.png$/);
        return images("./Logo.png");
      } else {
        if (photo.slice(0, 7) == "http://") {
          return photo;
        }
        return SERVER_IP + photo;
      }
    },
    formatDate(nowDate = true, date) {
      const updatedAt = nowDate ? new Date(Date.now()) : date;
      const day =
        updatedAt.getDate() > 9
          ? updatedAt.getDate()
          : "0" + updatedAt.getDate();
      const month =
        updatedAt.getMonth() > 8
          ? updatedAt.getMonth() + 1
          : "0" + (updatedAt.getMonth() + 1);
      return updatedAt.getFullYear() + "-" + month + "-" + day;
    },
    header(item) {
      if (item.type == "@")
        return this.$t("common_components.employee_creation.email_input");
      else if (item.type == "P")
        return this.$t(
          "common_components.employee_creation.phone_number_input"
        );
      else return "Telegram ID";
    },
    getContacts() {
      this.mobileNumberContactID = null;
      this.emailContactID = null;
      for (let i = 0; i < this.employee.contacts.length; ++i) {
        let curContact = this.employee.contacts[i];
        if (curContact.type == "P") {
          this.employee.mobile_number = curContact.value;
          this.mobileNumberContactID = curContact.id;
        }
        if (curContact.type == "@") {
          this.employee.email = curContact.value;
          this.emailContactID = curContact.id;
        }
      }
    },
    openOrCloseEmployeeOptionsMenu() {
      setTimeout(() => {
        this.employeeOptionsMenuEnabled ^= true;
      }, 50);
    },
    openOrCloseEmployeeFireOption() {
      this.employeeFireEnabled ^= true;
    },
    openOrCloseEmployeeDeleteOption() {
      this.employeeDeleteEnabled ^= true;
    },
    openOrCloseEmployeeMoveOption() {
      this.employeeMoveEnabled ^= true;
    },
    openOrCloseEmployeeEditOption() {
      this.employeeEditEnabled ^= true;
    },
    openSuccess() {
      this.$moshaToast(
        {
          title: this.$t("notification.success"),
        },
        {
          position: "bottom-right",
          timeout: 3000,
          transition: "slide",
          type: "success",
        }
      );
    },
    openError() {
      this.$moshaToast(
        {
          title: this.$t("notification.error"),
        },
        {
          position: "bottom-right",
          timeout: 3000,
          transition: "slide",
          type: "danger",
        }
      );
    },
    async deleteEmployee() {
      try {
        await axios.post(API_URIS.employeesBlock, {
          user_id: this.employee.id,
        });
        this.employeeDeleteEnabled = false;
        this.$emit("employeeEdited");
      } catch (err) {
        throw err;
      }
    },
    cancelEmployeeDelete() {
      this.employeeDeleteEnabled = false;
    },
    async fireEmployee(fireDate) {
      try {
        await axios.put(
          API_URIS.updateProfileByAdmin + this.employee.profile_id + "/",
          {
            fired_at: fireDate
              ? this.formatDate(false, fireDate)
              : this.formatDate(),
          }
        );
        this.employeeFireEnabled = false;
        this.$emit("employeeEdited");
      } catch (err) {
        throw err;
      }
    },
    cancelEmployeeFire() {
      this.employeeFireEnabled = false;
    },
    async moveEmployee(employeeData, selectedRolesList, selectedOrganization) {
      try {
        await this.editEmployee(
          employeeData,
          selectedRolesList,
          selectedOrganization
        );
        this.employeeMoveEnabled = false;
        this.$emit("employeeEdited");
      } catch (err) {
        throw err;
      }
    },
    cancelEmployeeMove() {
      this.employeeMoveEnabled = false;
    },
    async editEmployee(
      employeeData,
      selectedRolesList,
      selectedOrganization = null
    ) {
      try {
        this.employeeEditionError.hired_at = null;
        this.employeeEditionError.fired_at = null;
        this.employeeEditionError.status = null;
        this.employeeEditionError.date_of_birth = null;
        let editedEmployeeData = {};

        let newMobileNumber = "";
        let newEmail = "";
        for (let i = 0; i < employeeData.length; ++i) {
          let curEmployeeData = employeeData[i];
          if (
            curEmployeeData.dataHeader != "mobile_number" &&
            curEmployeeData.dataHeader != "email"
          ) {
            editedEmployeeData[curEmployeeData.dataHeader] =
              curEmployeeData.vModel;
          } else {
            if (curEmployeeData.dataHeader == "mobile_number")
              newMobileNumber = curEmployeeData.vModel;
            if (curEmployeeData.dataHeader == "email")
              newEmail = curEmployeeData.vModel;
          }

          if (
            curEmployeeData.dataHeader == "department_id" &&
            curEmployeeData.vModel == null
          ) {
            editedEmployeeData[curEmployeeData.dataHeader] =
              this.orgDetails.top_id;
          }
        }

        let userRoles = "";
        for (let i = 0; i < selectedRolesList.length; ++i) {
          if (i > 0) {
            userRoles += " ";
          }
          userRoles += selectedRolesList[i].role;
        }
        editedEmployeeData.roles = userRoles;

        if (!editedEmployeeData.vk_id) editedEmployeeData.vk_id = null;

        if (selectedOrganization) {
          editedEmployeeData.department_id = selectedOrganization.id;
        }

        let request = await axios.put(
          API_URIS.updateProfileByAdmin + this.employee.profile_id + "/",
          editedEmployeeData
        );
        if (request.status === 200 || 201) {
          this.openSuccess();
        } else {
          this.openError();
        }

        this.updateContact("P", this.mobileNumberContactID, newMobileNumber);
        this.updateContact("@", this.emailContactID, newEmail);

        this.$emit("employeeEdited");

        this.employeeEditEnabled = false;
      } catch (err) {
        if (err.response?.data.hired_at?.length) {
          this.employeeEditionError.hired_at = err.response.data.hired_at[0];
        }
        if (err.response?.data.fired_at?.length) {
          this.employeeEditionError.fired_at = err.response.data.fired_at[0];
        }
        if (err.response?.data.status?.length) {
          this.employeeEditionError.status = err.response.data.status[0];
        }
        if (err.response?.data.date_of_birth?.length) {
          this.employeeEditionError.date_of_birth =
            err.response.data.date_of_birth[0];
        }
        this.openError();
        throw err;
      }
    },
    async updateContact(contactType, contactID, contactValue) {
      if (contactID) {
        if (contactValue) {
          try {
            await axios.put(API_URIS.updateContactByAdmin + contactID + "/", {
              contact_id: contactValue,
            });
            this.$emit("employeeEdited");
          } catch (err) {
            throw err;
          }
        } else {
          try {
            await axios.delete(API_URIS.deleteContact + contactID + "/");
            this.$emit("employeeEdited");
          } catch (err) {
            throw err;
          }
        }
      } else if (contactValue) {
        try {
          await axios.post(API_URIS.createContactByAdmin, {
            contact_id: contactValue,
            contact_type: contactType,
            profile: this.employee.profile_id,
          });
          this.$emit("employeeEdited");
        } catch (err) {
          throw err;
        }
      }
    },
    cancelEmployeeEdit() {
      this.employeeEditEnabled = false;
    },
  },
};
</script>

<style scoped>
.organization_employee {
  max-width: 303px;
  width: 100%;
  padding: 20px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  cursor: pointer;
}
.employee_top_info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.avatar_and_options {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.employee_avatar {
  height: 52px;
  width: 52px;
  border-radius: 50%;
  object-fit: cover;
}
.employee_options {
  padding: 0px;
  position: relative;
  display: flex;
  justify-content: center;
}
.employee_options_icon {
  height: 24px;
  width: 24px;
}
.employee_options_menu {
  margin-top: 8px;
  transform: translateX(calc(-50% + 12px));
  filter: drop-shadow(0px 3px 40px rgba(0, 0, 0, 0.14));
  border-radius: 12px;
  position: absolute;
  overflow: hidden;
  top: 24px;
  display: flex;
  flex-direction: column;
  z-index: 3;
}
.employee_options_menu_item {
  width: 168px;
  padding: 16px;
  display: flex;
  gap: 12px;
}
.bottom_bordered {
  border-bottom: 1px solid var(--secondOverlay);
}
.employee_options_menu_item_icon {
  height: 24px;
  width: 24px;
}
.employee_option_menu_item_text {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.employee_name_and_job {
  display: flex;
  flex-direction: column;
}
.employee_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: -0.02em;
  text-align: left;
}
.employee_job {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: -0.02em;
  text-align: left;
}
.employee_details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.employee_detail {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.detail_header {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
}

.detail_value {
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  word-break: break-word;
}
.round_menu_icon {
  width: 18px;
  height: 18px;
}
.branding_icon {
  width: 20px;
  height: 20px;
}
.delete_icon {
  width: 18px;
  height: 18px;
}
.close_icon {
  width: 24px;
  height: 24px;
}
.replace_icon {
  width: 24px;
  height: 24px;
}
</style>