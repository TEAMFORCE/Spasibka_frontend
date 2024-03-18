<template>
  <div class="participants_tab_header">
    <div class="download_excell_wrapper" v-if="userRole == 'Администратор'">
      <button
        v-if="downloadPending"
        class="download_excell brand-secondary-bg general-brand-color"
        disabled
      >
        {{ $t("analyticsPage.reports.processing") }}
      </button>
      <button
        v-else
        class="download_excell general-brand-bg"
        @click="downloadExcel"
      >
        <DownloadIcon :currentColor="getIconColor()" />
        {{ $t("analyticsPage.reports.inputs.uplToExcel") }}
      </button>
    </div>
    <div class="search_wrapper">
      <SearchByUserOrganization
        width="270px"
        :departmentsList="departmentsList"
        @departmentChecked="setDepartmentListForRequest"
      />
      <div class="search_by_user_wrapper">
        <input
          class="search_by_user"
          type="text"
          :placeholder="$t('employeesPage.searchByUser')"
          v-model="searchString"
          v-debounce:800="searchByUser"
        />
        <SearchIcon />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { vue3Debounce } from "vue-debounce";

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

import DownloadIcon from "@/components/Icons/download.vue";
import SearchByUserOrganization from "@/components/Employees/filter-by-organization.vue";
import SearchIcon from "@/components/Icons/search.vue";
import vSelect from "vue-select";

export default {
  name: "ParticipantsTabHeader",
  directives: {
    debounce: vue3Debounce({ lock: true }),
  },
  components: {
    DownloadIcon,
    SearchByUserOrganization,
    SearchIcon,
    vSelect,
  },
  props: {
    departmentsList: {
      requred: true,
      default: [],
    },
  },
  data() {
    return {
      downloadPending: false,
      searchString: "",
      departmentsListForRequest: [],
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    userRole() {
      let role = "";
      for (let i = 0; i < this.profileInfo?.privileged.length; ++i) {
        let curRole = this.profileInfo.privileged[i];
        role = curRole.role_name;
        if (role == "Администратор") {
          break;
        }
      }
      if (role == "") {
        role = "Пользователь";
      }
      return role;
    },
  },
  methods: {
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },

    setDepartmentListForRequest(list) {
      this.departmentsListForRequest = list;
      this.$emit(
        "searchByDepartment",
        this.searchString,
        this.departmentsListForRequest
      );
    },
    searchByUser() {
      this.$emit(
        "searchByUserName",
        this.searchString,
        this.departmentsListForRequest
      );
    },
    async downloadExcel() {
      //   try {
      //     this.downloadPending = true;
      //     let departmentArray = [];
      //     for (let i = 0; i < this.departmentsListForRequest.length; i++) {
      //       departmentArray.push(
      //         `department_id=${this.departmentsListForRequest[i]}`
      //       );
      //     }
      //     let queryParams = departmentArray.join("&");
      //     let response = await axios.get(
      //       `${API_URIS.questionnariesParticipants.replace(
      //         "id",
      //         this.$route.params.id
      //       )}?name=${this.searchString}&${queryParams}&xlsx=1`,
      //       { responseType: "arraybuffer" }
      //     );
      //     const blob = new Blob([response.data], {
      //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      //     });
      //     let xlsxUrl = URL.createObjectURL(blob);
      //     let link = document.createElement("a");
      //     link.href = xlsxUrl;
      //     link.download = this.$t("surveys.xlsx.participantsResults") + ".xlsx";
      //     link.click();
      //     this.downloadPending = false;
      //   } catch (err) {
      //     this.downloadPending = false;
      //     throw err;
      //   }
    },
  },
};
</script>

<style scoped>
.participants_tab_header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.download_excell {
  width: 192px !important;
  height: 52px !important;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: var(--generalColorWhite);
  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  transition: 0.3s;
}
.download_icon {
  width: 14px;
  height: 18px;
}
.download_excell:hover {
  opacity: 0.9;
  transform: translate(0px, -1px);
}
.search_wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}
.search_by_user_wrapper {
  position: relative;
  width: 354px;
  height: 52px;
  display: flex;
  align-items: center;
}
.search_by_user {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 1px solid var(--neutral5);
  padding: 0 34px 0 16px;
  box-sizing: border-box;
}
.search_by_user::placeholder {
  font-family: "Roboto" !important;
  font-size: 14px;
  font-weight: 400;
}
.search_icon {
  width: 13px;
  position: absolute;
  right: 16.75px;
  margin: 4px 0 0 0;
}
</style>