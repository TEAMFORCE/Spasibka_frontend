<template>
  <div 
    class="organization_administration main-layout-page general-white-bg"
    v-scroll-end="handleScrollEnd"
  >
    <div class="top_info">
      <div v-if="!orgDetails?.parent_id" class="organization_header">
        <h1 class="organization_structure_text general-contrast-color">
          {{ $t("organization.title") }}
        </h1>
        <OrganizationSettingsButtons :organizationId="orgDetails" />
      </div>
      <div v-if="orgDetails?.parent_id" class="non_root_header">
        <button
          class="back_to_parent brand-secondary-bg"
          @click="
            $router.push('/organization_administration/' + orgDetails.parent_id)
          "
        >
          <BackIcon />
        </button>
        <h1 class="organization_structure_text">
          {{ orgDetails?.name }}
        </h1>
      </div>
      <div class="breadcrumb">
        <div
          class="breadcrumb_item general-contrast-color"
          v-for="(item, index) in breadcrumb"
        >
          <h1 v-if="index > 0" class="breadcrumb_text">&#8594;</h1>
          <h1
            class="breadcrumb_text not_arrow general-contrast-color"
            :class="{ current: item.organization_id == $route.params.id }"
            @click="departmentChanged(item.organization_id)"
          >
            {{ item.organization_name }}
          </h1>
        </div>
      </div>
    </div>
    <div class="organization_info">
      <OrganizationLabel
        v-if="!orgDetails?.parent_id"
        :orgDetails="orgDetails"
        @getOrganizationInfo="getOrganizationInfo"
      />

      <OrganizationComponents
        @departmentCreated="departmentCreated"
        @departmentChanged="departmentChanged"
        :departments="departments"
        :orgDetails="orgDetails"
        :organizationEmployees="organizationEmployees"
        :stateUpdated="stateUpdated"
        :isLoading="isLoading"
        :hasNewData="hasNewData"
        @getEmployees="getEmployees"
        @employeeEdited="employeeEdited"
        @departmentEdited="getOrganizationDepartments"
        @searchByUser="searchByUser"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { vue3Debounce } from "vue-debounce";

import axios from "axios";
import { API_URIS } from "@/constants/api";

import { organizationSettingsStore } from "@/store/organization-settings";

export default {
  name: "OrganizationAdministration",
  components: {
    OrganizationLabel: defineAsyncComponent(() =>
      import(
        "@/components/OrganizationAdministrationElements/OrganizationLabel.vue"
      )
    ),
    OrganizationComponents: defineAsyncComponent(() =>
      import(
        "@/components/OrganizationAdministrationElements/OrganizationComponents.vue"
      )
    ),
    OrganizationSettingsButtons: defineAsyncComponent(() =>
      import(
        "@/components/OrganizationAdministrationElements/AdditionalComponents/setting-buttons.vue"
      )
    ),
    BackIcon: defineAsyncComponent(() => import("@/components/Icons/back.vue")),
  },
  directives: {
    debounce: vue3Debounce({ lock: true }),
    scrollEnd: {
      mounted(el, binding) {
        const handler = () => {
          let tolerance = 1;
          if (el.scrollTop + el.clientHeight + tolerance >= el.scrollHeight) {
            binding.value();
          }
        };
        el.addEventListener("scroll", handler);
        el._handleScroll = handler; // Store the handler on the element
      },
      beforeUnmount(el) {
        el.removeEventListener("scroll", el._handleScroll);
      },
    },
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
      departments: null,
      orgDetails: null,
      organizationEmployees: [],
      breadcrumb: [],
      stateUpdated: false,
      isLoading: true,
      hasNewData: true,
      paginationPage: 1,
      limit: 20,
      searchString: "",
    };
  },
  watch: {
    $route() {
      if (
        this.$route.name === "OrganizationAdministration" &&
        this.$route.params.id
      ) {
        this.getOrganizationInfo();
        this.getOrganizationDepartments();
        this.getBreadcrumb();
      }
    },
  },
  methods: {
    handleScrollEnd() {
      this.paginationPage++;
      this.getEmployees();
    },
    departmentCreated() {
      this.getOrganizationDepartments();
    },
    departmentChanged(departmentId) {
      this.$router.push("/organization_administration/" + departmentId);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    async getBreadcrumb() {
      try {
        const response = await axios.get(
          API_URIS.breadcrumbsOrganizations + this.$route.params.id + "/"
        );
        this.breadcrumb = response.data;
      } catch (err) {
        throw err;
      }
    },
    async getOrganizationInfo() {
      try {
        const response = await axios.get(
          API_URIS.organizations + this.$route.params.id + "/"
        );
        this.orgDetails = response.data;
        this.getEmployees();
      } catch (err) {
        if (err.response.status == 403) {
          this.$router.push("/feed");
        }
        throw err;
      }
    },
    async getOrganizationDepartments() {
      try {
        const response = await axios.post(API_URIS.getOrganizationDepartments, {
          organization_id: this.$route.params.id,
        });
        this.departments = response.data;
      } catch (err) {
        throw err;
      }
    },
    async searchByUser(searchString) {
      this.searchString = searchString;
      this.organizationEmployees = [];
      this.hasNewData = true;
      this.paginationPage = 1;
      this.getEmployees();
    },
    async getEmployees() {
      if (!this.hasNewData) return;
      try {
        this.isLoading = true;
        let params = {
          offset: this.paginationPage,
          limit: this.limit
        }
        if (this.orgDetails?.id !== this.orgDetails?.top_id) {
          params.department_id = this.$route.params.id;
        }
        if (this.searchString) {
          params.name = this.searchString;
        }
        const response = await axios.get(API_URIS.employees, { params });
        this.organizationEmployees.push(...response.data);
        this.stateUpdated ^= true;
        if (response.data.length < this.limit) this.hasNewData = false;
        this.isLoading = false;
      } catch(err) {
        throw err;
      }
    },
    employeeEdited() {
      window.location.reload();
    },
  },
  mounted() {
    this.getOrganizationInfo();
    this.getOrganizationDepartments();
    this.getBreadcrumb();
  },
};
</script>

<style scoped>
.organization_administration {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 54px 52px 54px;
  border-radius: 24px 0px 0px 0px;
  overflow-y: auto;
  overflow-x: hidden;
}
.organization_administration::-webkit-scrollbar {
  width: 8px;
}
.organization_administration::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.non_root_header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.back_to_parent {
  padding: 5.33px;
  width: 32px;
  height: 32px;
  border-radius: 7.11111px;
}

.breadcrumb {
  display: flex;
  gap: 5px;
}
.breadcrumb_item {
  display: flex;
  gap: 5px;
}
.breadcrumb_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  text-align: left;
}
.breadcrumb_text.current {
  color: var(--generalBrand);
}
.not_arrow:hover {
  cursor: pointer;
}

.top_info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.organization_header {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.organization_structure_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  text-align: left;
}
.top_info_button {
  border-radius: 8px;
  display: flex;
  align-items: center;
}
.top_info_buttons {
  display: flex;
  gap: 16px;
}
.top_info_button_icon {
  width: 24px;
  height: 24px;
}
.organization_info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.organization_payment_and_contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.back_icon {
  width: 14px;
  height: 12px;
  margin: 0 0 0 4px;
}
</style>