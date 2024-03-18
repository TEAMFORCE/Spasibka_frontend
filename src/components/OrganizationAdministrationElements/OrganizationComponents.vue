<template>
  <div class="organization_components">
    <div class="organization_components_filters_wrapper">
      <div class="organization_components_filters">
        <button
          class="organization_components_filter minor-info-secondary-bg"
          :class="{ active: item.title == currentFilter }"
          v-for="item in organizationComponentsFilters"
          @click="item.click"
        >
          <h1
            class="filter_button_text general-contrast-color"
            :class="{ active: item.title == currentFilter }"
          >
            {{ item.title }}
          </h1>
        </button>
      </div>
      <div 
        v-if="currentFilter === $t('organization.nav_filter.employees')"
        class="search_by_user_wrapper"
      >
        <input
          type="text"
          class="search_by_user_input"
          :placeholder="$t('employeesPage.searchByUser')"
          v-model="searchString"
          v-debounce:800="searchByUser"
        />
        <button
          class="_clear_input_button"
          v-if="searchString"
          @click="clearSearchSring"
        >
          <CloseIcon :currentColor="getIconColor()" />
        </button>
        <SearchIcon />
      </div>
    </div>
    <OrganizationEmployees
      v-if="currentFilter == $t('organization.nav_filter.employees')"
      :orgDetails="orgDetails"
      :organizationEmployees="organizationEmployees"
      :stateUpdate="stateUpdated"
      :isLoading="isLoading"
      :hasNewData="hasNewData"
      @getEmployees="getEmployees"
      @employeeEdited="employeeEdited"
    />
    <Departments
      v-if="currentFilter == $t('organization.nav_filter.divisions')"
      @departmentCreated="$emit('departmentCreated')"
      @departmentChanged="departmentChanged"
      @departmentEdited="departmentEdited"
      :departments="departments"
      :orgDetails="orgDetails"
    />
    <ChildOrganizations
      v-if="currentFilter == $t('organization.nav_filter.subsidiaries')"
      @departmentCreated="$emit('departmentCreated')"
      :departments="departments"
      :orgDetails="orgDetails"
    />
  </div>
</template>

<script>
import { vue3Debounce } from "vue-debounce";

import Departments from "./Departments.vue";
import OrganizationEmployees from "./OrganizationEmployees.vue";
import ChildOrganizations from "./ChildOrganizations.vue";

import SearchIcon from "@/components/Icons/search.vue";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "OrganizationComponents",

  components: {
    OrganizationEmployees,
    Departments,
    ChildOrganizations,
    SearchIcon,
    CloseIcon,
  },
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  props: {
    departments: {
      required: true,
    },
    orgDetails: {
      reqiured: true,
    },
    organizationEmployees: {
      required: true,
    },
    stateUpdated: {
      required: true,
      default: false,
    },
    isLoading: {
      reqiured: true,
    },
    hasNewData: {
      required: true,
    },
  },
  data() {
    return {
      currentFilter: this.$t("organization.nav_filter.employees"),
      organizationComponentsFilters: [
        {
          title: this.$t("organization.nav_filter.employees"),
          click: () => {
            this.currentFilter = this.$t("organization.nav_filter.employees");
          },
        },
        {
          title: this.$t("organization.nav_filter.divisions"),
          click: () => {
            this.currentFilter = this.$t("organization.nav_filter.divisions");
          },
        },
        // {
        //   title: this.$t("organization.nav_filter.subsidiaries"),
        //   click: () => {
        //     this.currentFilter = this.$t(
        //       "organization.nav_filter.subsidiaries"
        //     );
        //   },
        // },
      ],

      searchString: "",
    };
  },
  methods: {
    getIconColor() {
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      return generalContrast;
    },
    clearSearchSring() {
      this.searchString = "";
      this.$emit("searchByUser", this.searchString);
    },
    searchByUser() {
      this.$emit("searchByUser", this.searchString);
    },
    departmentEdited() {
      this.$emit("departmentEdited");
    },
    departmentChanged(departmentId) {
      this.$emit("departmentChanged", departmentId);
    },
    getEmployees(paginationPage) {
      this.$emit("getEmployees", paginationPage);
    },
    employeeEdited() {
      this.$emit("employeeEdited");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@400&display=swap");
.organization_components {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.organization_components_filters_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.organization_components_filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.organization_components_filter {
  border-radius: 12px;
  padding: 8px 14px;
}
.organization_components_filter.active {
  background-color: var(--generalBrand);
  box-shadow: 0px 0px 7px 2px rgba(74, 77, 69, 0.02),
    0px 8px 24px 2px rgba(74, 77, 69, 0.12);
}
.filter_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.filter_button_text.active {
  color: var(--generalColorWhite);
}
.search_by_user_wrapper {
  max-width: 400px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}
.search_by_user_input {
  max-width: 300px;
  width: 100%;
  height: 38px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 8px;
  padding: 10px 30px 10px 10px;
  box-sizing: border-box;
}
._clear_input_button {
  width: 24px;
  height: 24px;
  position: absolute;
  right: 30px;
  background-color: transparent;
}
.search_icon {
  width: 12px;
  position: absolute;
  right: 16px;
}
</style>