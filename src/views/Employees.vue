<template>
  <div class="employees_page" ref="employeePage">
    <h1 class="employees_page_title">{{ $t("employeesPage.title") }}</h1>
    <div class="employees_page_search_header">
      <div class="search_by_department">
        <input
          class="search_by_user_input"
          type="text"
          :placeholder="$t('employeesPage.searchByUser')"
          v-model="searchByUsername"
          v-debounce:800="searchByUser"
        />
        <SearchByUserOrganization
          :currentDepartment="currentDepartment"
          :departmentsList="departmentsList"
          @departmentChecked="setDepartmentListForRequest"
        />
        <button
          class="filterButton tooltip_container"
          @click="openFilterPopup"
          :data-tooltip="$t('employeesPage.filter')"
        >
          <FilterIcon />
        </button>
      </div>
    </div>
    <div class="employee_page_content">
      <div class="employees_page_employee_list">
        <div
          class="employee_card_wrapper"
          v-for="item in employeesList"
          ref="employeeCard"
        >
          <EmployeeCard :employeeData="item" />
        </div>
        <div v-if="isLoading" class="content_loading">
          <span class="loader"></span>
        </div>
        <div class="_observer" ref="observer"></div>
      </div>

      <div class="employees_page_filter_wrapper">
        <SearchByWorkerStatus
          :statuses="currentStatuses"
          @searchByUsername="searchByUserFromFilter"
          @filterChanged="filterChanged"
        />
      </div>
    </div>
    <Transition>
      <div
        class="filter_popup_wrapper"
        v-if="filterPopupVisible && windowWidth < 1281"
        @click.self="openFilterPopup"
      >
        <SearchByWorkerStatus
          :statuses="currentStatuses"
          @searchByUsername="searchByUserFromFilter"
          @filterChanged="filterChanged"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

import axios from "axios";
import { API_URIS } from "@/constants/api";

import { vue3Debounce } from "vue-debounce";

import vSelect from "vue-select";

export default {
  name: "Employees",
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  components: {
    vSelect,
    EmployeeCard: defineAsyncComponent(() =>
      import("@/components/Employees/employee-card.vue")
    ),
    SearchByUserOrganization: defineAsyncComponent(() =>
      import("@/components/Employees/filter-by-organization.vue")
    ),
    SearchByWorkerStatus: defineAsyncComponent(() =>
      import("@/components/Employees/filter-by-worker-status.vue")
    ),
    FilterIcon: defineAsyncComponent(() =>
      import("@/components/Icons/filter.vue")
    ),
  },
  data() {
    return {
      filterPopupVisible: false,
      currentDepartment: null,
      departmentsList: [],
      searchByUsername: "",
      selectedDepartmentFilter: null,
      dismissed: false,
      inOffice: false,
      inVacation: false,
      remotely: false,
      onSick: false,
      employeesList: [],
      departmentListForRequest: [],
      isLoading: false,
      paginationPage: 1,
      hasNewData: true,
      isSearch: false,
    };
  },
  computed: {
    windowWidth() {
      return window.innerWidth;
    },
    windowHeight() {
      return window.innerHeight;
    },
    currentStatuses() {
      return {
        dismissed: this.dismissed,
        inOffice: this.inOffice,
        inVacation: this.inVacation,
        remotely: this.remotely,
        onSick: this.onSick,
      };
    },
  },
  watch: {
    departmentListForRequest() {
      this.paginationPage = 0;
      this.hasNewData = true;
      this.employeesList = [];
      setTimeout(() => {
        this.paginationPage = 1;
        this.getEmployees();
      }, 200);
    },
  },
  methods: {
    openFilterPopup() {
      this.filterPopupVisible ^= true;
    },
    filterChanged(statuses) {
      this.hasNewData = true;
      this.employeesList = [];
      this.paginationPage = 1;
      this.dismissed = statuses.dismissed;
      this.inOffice = statuses.inOffice;
      this.inVacation = statuses.inVacation;
      this.remotely = statuses.remotely;
      this.onSick = statuses.onSick;
      this.getEmployees();
      this.openFilterPopup();
    },
    setDepartmentListForRequest(list) {
      this.departmentListForRequest = [...list];
    },
    observer() {
      let target = this.$refs.observer;
      let newObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!this.isLoading && this.hasNewData && !this.isSearch) {
                this.paginationPage++;
                this.getEmployees();
              }
            }
          });
        },
        {
          threshold: 1,
        }
      );
      newObserver.observe(target);
    },
    async getEmployees() {
      if (this.hasNewData) {
        try {
          const settingsWidth = 300;
          const employeeCardSize = 234 * 262;

          let limit = Math.max(
            15,
            Math.floor(
              ((this.windowWidth - settingsWidth) * this.windowHeight) /
                employeeCardSize
            ) + 5
          );
          if (this.windowWidth < 1281) {
            limit = 20;
          }
          this.isLoading = true;
          let response = await axios.post(API_URIS.colleagues, {
            limit,
            offset: this.paginationPage,
            fired_at: this.dismissed ? 1 : 0,
            in_office: this.inOffice ? 1 : 0,
            on_holiday: this.inVacation ? 1 : 0,
            on_distance: this.remotely ? 1 : 0,
            illness: this.onSick ? 1 : 0,
            departments: !!this.departmentListForRequest.length
              ? this.departmentListForRequest
              : null,
          });
          for (let i = 0; i < response.data.length; i++) {
            this.employeesList.push(response.data[i]);
          }
          if (response.data.length < limit) {
            this.hasNewData = false;
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 200);
        } catch (error) {
          throw error;
        }
      }
    },
    async getDepartments() {
      try {
        let response = await axios.get(API_URIS.departmentsTree);
        this.departmentsList = response.data;
      } catch (error) {
        throw error;
      }
    },
    async searchByUser() {
      if (this.searchByUsername) {
        this.employeesList = [];
        this.isSearch = true;
      } else {
        this.employeesList = [];
        this.isSearch = false;
      }
      try {
        let response = await axios.post(API_URIS.colleagues, {
          limit: 1000,
          offset: 1,
          fired_at: this.dismissed ? 1 : 0,
          in_office: this.inOffice ? 1 : 0,
          on_holiday: this.inVacation ? 1 : 0,
          on_distance: this.remotely ? 1 : 0,
          illness: this.onSick ? 1 : 0,
          name: this.searchByUsername,
        });
        this.employeesList = response.data;
      } catch (error) {
        throw error;
      }
    },
    async searchByUserFromFilter(nameFromFilter) {
      if (nameFromFilter) {
        this.isSearch = true;
        this.employeesList = [];
      } else {
        this.isSearch = false;
        this.employeesList = [];
      }
      try {
        let response = await axios.post(API_URIS.colleagues, {
          limit: 1000,
          offset: 1,
          fired_at: this.dismissed ? 1 : 0,
          in_office: this.inOffice ? 1 : 0,
          on_holiday: this.inVacation ? 1 : 0,
          on_distance: this.remotely ? 1 : 0,
          illness: this.onSick ? 1 : 0,
          name: nameFromFilter,
        });
        this.employeesList = response.data;
        this.openFilterPopup();
      } catch (error) {
        throw error;
      }
    },
  },
  async mounted() {
    await this.getDepartments();
    await this.getEmployees().then(() => {
      this.observer();
    });
  },
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.employees_page {
  padding: 52px;
  background: var(--generalColorWhite);
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  border-radius: 24px 0 0 0;
  width: 100%;
  overflow-y: scroll !important;
}
.employees_page::-webkit-scrollbar {
  width: 8px;
}
.employees_page::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.employees_page_title {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  color: var(--generalContrast);
  text-align: left;
}
.employees_page_search_header {
  width: 100%;
  height: 100px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: -52px;
  background-color: var(--generalColorWhite);
  z-index: 1000;
}
.search_by_department {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.search_by_user_input {
  background-color: var(--generalColorWhite);
  width: 326px;
  height: 52px;
  padding: 8px 12px;
  border: 1px solid var(--neutral5);
  border-radius: 12px;
  outline: none;
  color: var(--generalColorSecondary);
  font-size: 16px;
  display: none;
  box-sizing: border-box;
}
.filterButton {
  position: relative;
  display: none;
}

.search_by_filters {
  display: flex;
  gap: 2%;
  min-width: 630px;
}
.checkbox_title {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: var(--generalColorDark);
}
.employee_page_content {
  width: 100%;
  display: flex;
  gap: 25px;
}
.employees_page_employee_list {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
}
.content_loading {
  width: 100%;
  height: 100%;
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
.filter_icon {
  width: 14px;
  height: 14px;
}
@media (max-width: 1600px) {
  .employees_page_search_header {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    height: 140px !important;
  }
}
@media (max-width: 1280px) {
  .filter_popup_wrapper {
    position: fixed;
    overflow: hidden;
    top: 0;
    left: 0;
    width: 100vw;
    height: 110vh;
    backdrop-filter: blur(12px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .employees_page_filter_wrapper {
    display: none;
  }
  .filterButton {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: var(--secondaryColorBrand);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.3s;
  }
  .filterButton:hover {
    background-color: var(--secondaryColorBrandDark);
  }
  .filterButton:active {
    transform: scale(0.98);
  }
  .search_by_user_input {
    display: block;
    width: 200px;
  }
  .employees_page {
    padding: 24px;
    margin: 0 0 100px 0;
  }
  .employees_page_search_header {
    top: -24px;
  }
}
@media (max-width: 720px) {
  .filterButton {
    width: 52px;
    height: 52px;
    position: fixed;
    bottom: 14%;
    right: 6%;
  }
}
@media (max-width: 680px) {
  .employees_page {
    margin: 0;
    padding: 24px 24px 100px 24px;
  }
  .search_by_ {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  .employees_page_search_header {
    top: -24px;
    height: 220px !important;
    position: relative;
    top: 0px;
  }
  .search_by_user_input {
    width: 96%;
  }
  .search_by_filters {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    min-width: 100%;
  }
  .search_by_department {
    width: 100%;
  }
}
@media (max-width: 480px) {
  .employees_page_search_header {
    height: 200px !important;
    gap: 8px;
  }
  .search_by_department {
    gap: 8px;
  }
  .search_by_user_input {
    width: 92%;
  }
  .search_by_filters {
    gap: 8px;
  }
}
</style>