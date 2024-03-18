<template>
  <div class="organization_employees">
    <!-- <div class="employee_search_and_filter">
      <EmployeeSearchInput @searchValueChanged="searchValueChanged" />
    </div> -->
    <div v-if="searchValue.length === 0" class="employees_list">
      <CreateEmployee
        v-if="employeeCreationEnabled"
        @cancelEmployeeCreation="cancelEmployeeCreation"
        @createEmployee="createEmployee"
        :employeeCreationError="employeeCreationError"
      />
      <button
        class="create_new_employee brand-secondary-bg"
        @click="openOrCloseEmployeeCreation"
      >
        <PlusIcon class="plus_icon"/>
      </button>
      <OrganizationEmployee
        v-for="item in organizationEmployees"
        @employeeEdited="employeeEdited"
        :employee="item"
        :orgDetails="orgDetails"
        :stateUpdate="stateUpdate"
      />
      <div v-if="isLoading" class="content_loading">
        <span class="loader"></span>
      </div>
      <div class="_observer" ref="observer"></div>
    </div>
    <div v-else class="employees_search_list">
      <OrganizationEmployee
        v-for="item in foundedEmployees"
        :employee="item"
        :orgDetails="orgDetails"
        :stateUpdate="stateUpdate"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import OrganizationEmployee from "./OrganizationEmployee.vue";
import CreateEmployee from "./CreateEmployee.vue";
import EmployeeSearchInput from "./AdditionalComponents/search-field.vue";

import PlusIcon from "@/components/Icons/plus.vue";

export default {
  name: "OrganizationEmployees",
  components: {
    OrganizationEmployee,
    CreateEmployee,
    EmployeeSearchInput,
    PlusIcon,
  },
  props: {
    orgDetails: {
      required: true,
    },
    organizationEmployees: {
      required: true,
    },
    stateUpdate: {
      default: false,
    },
    isLoading: {
      required: true,
    },
    hasNewData: {
      required: true,
    },
  },
  data() {
    return {
      currentEployees: null,
      searchValue: "",
      foundedEmployees: null,
      employeeCreationEnabled: false,
      employeeCreationError: {
        email: null,
        hiredAt: null,
        department_id: null,
      },

      paginationPage: 1,
    };
  },
  watch: {
    organizationEmployees() {
      this.currentEployees = this.organizationEmployees;
    },
    paginationPage() {
      this.getEmployees();
    },
  },
  methods: {
    // observer() {
    //   let target = this.$refs.observer;
    //   let newObserver = new IntersectionObserver(
    //     (entries, observer) => {
    //       entries.forEach((entry) => {
    //         if (entry.isIntersecting) {
    //           if (!this.isLoading && this.hasNewData) {
    //             this.paginationPage++;
    //           }
    //         }
    //       });
    //     },
    //     {
    //       threshold: 1,
    //     }
    //   );
    //   newObserver.observe(target);
    // },
    searchValueChanged(value) {
      this.searchValue = value;
      let employeesToSearch = this.currentEployees;
      this.foundedEmployees = employeesToSearch.filter((el) => {
        return (
          el.first_name.slice(0, value.length) == value ||
          el.surname.slice(0, value.length) == value ||
          el.middle_name.slice(0, value.length) == value
        );
      });
    },
    getImgUrl(imageName) {
      var images = require.context(
        "@/assets/OrganizationAdministrationImages",
        false,
        /\.png$/
      );
      return images("./" + imageName + ".png");
    },
    openOrCloseEmployeeCreation() {
      this.employeeCreationEnabled ^= true;
    },
    cancelEmployeeCreation() {
      this.employeeCreationEnabled = false;
    },
    getEmployees() {
      this.$emit("getEmployees", this.paginationPage);
    },
    employeeEdited() {
      this.$emit("employeeEdited");
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
    openError(errorMessage) {
      this.$moshaToast(
        {
          title: errorMessage || this.$t("notification.error"),
        },
        {
          position: "bottom-right",
          timeout: errorMessage ? 6000 : 3000,
          transition: "slide",
          type: "danger",
        }
      );
    },
    async createEmployee(employeeData) {
      try {
        this.employeeCreationError.hired_at = null;
        this.employeeCreationError.email = null;
        let employeeSendData = {};
        if (employeeData.telegramName)
          employeeSendData["tg_name"] = employeeData.telegramName;
        if (employeeData.telegramID)
          employeeSendData["tg_id"] = employeeData.telegramID;
        if (employeeData.surname)
          employeeSendData["surname"] = employeeData.surname;
        if (employeeData.firstName)
          employeeSendData["first_name"] = employeeData.firstName;
        if (employeeData.middleName)
          employeeSendData["middle_name"] = employeeData.middleName;
        if (employeeData.nickname)
          employeeSendData["nickname"] = employeeData.nickname;
        if (employeeData.job_title)
          employeeSendData["job_title"] = employeeData.job_title;
        if (employeeData.gender)
          employeeSendData["gender"] = employeeData.gender;
        if (employeeData.status)
          employeeSendData["status"] = employeeData.status;
        if (employeeData.hiredAt)
          employeeSendData["hired_at"] = employeeData.hiredAt;
        if (employeeData.date_of_birth)
          employeeSendData["date_of_birth"] = employeeData.date_of_birth;
        if (employeeData.email) employeeSendData["email"] = employeeData.email;
        if (employeeData.phoneNumber)
          employeeSendData["phone_number"] = employeeData.phoneNumber;
        employeeSendData["organization_id"] = this.orgDetails.top_id;
        if (employeeData.departmentId)
          employeeSendData["department_id"] = employeeData.departmentId;
        else employeeSendData["department_id"] = this.orgDetails.top_id;

        let request = await axios.post(
          API_URIS.createEmployee,
          employeeSendData
        );
        if (request.status === 200 || 201) {
          this.openSuccess();
        } else {
          this.openError();
        }
        this.employeeCreationEnabled = false;
        // this.getEmployees();
        window.location.reload();
      } catch (err) {
        this.employeeCreationError.hiredAt = null;
        this.employeeCreationError.email = null;
        this.employeeCreationError.department_id = null;
        if (err.response.data.hired_at?.length) {
          this.employeeCreationError.hiredAt = err.response.data.hired_at[0];
        }
        if (err.response.data.email?.length) {
          this.employeeCreationError.email = err.response.data.email[0];
        }
        if (err.response.data.department_id?.length) {
          this.employeeCreationError.department_id =
            err.response.data.department_id[0];
        }
        if (err.response.data.length > 0) {
          this.openError(err.response.data[0]);
        } else {
          this.openError(null);
        }
        throw err;
      }
    },
  },
  mounted() {
    // this.observer();
  },
};
</script>

<style scoped>
.content_loading {
  width: 100%;
  height: 10%;
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--generalColorWhite);
  border-bottom-color: var(--generalBrand);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.organization_employees {
  /* display: flex; */
  width: 100%;
  /* flex-direction: column; */
  /* flex-wrap: wrap; */
  /* gap: 20px; */
}
.employees_list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.employees_search_list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.create_new_employee {
  max-width: 343px;
  width: 100%;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}
@media (max-width: 770px) {
  .create_new_employee {
    padding: 20px;
  }
}
.plus_icon {
  height: 32px;
  width: 32px;
}
.plus_large_icon {
  width: 82px;
  height: 82px;
}
</style>