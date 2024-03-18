<template>
  <div class="analytics_balance">
    <div class="table_filters">
      <div class="download_excell_wrapper">
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
      <SearchInput
        :placeholder="this.$t('employeesPage.searchByUser')"
        width="360px"
        @searchStringChanged="searchByUser"
      />
      <FilterByOrganization
        width="360px"
        @departmentChecked="setDepartmentListForRequest"
      />
      <div class="fired_users_switcher">
        <h4 class="fired_users_switcher_title">
          {{ $t("analyticsPage.adminAnalytics.balance.firedUserShow") }}
        </h4>
        <div class="_switch">
          <label class="switch">
            <input type="checkbox" v-model="showFired" @change="getWithFired" />
            <span class="slider round"></span>
          </label>
        </div>
      </div>
    </div>
    <div class="table_wrapper" v-if="rows.length">
      <vue-good-table
        ref="vgt"
        mode="remote"
        styleClass="vgt-table"
        :rows="rows"
        :columns="columns"
        @sort-change="onSortChange"
      >
        <template #table-row="props" ref="_myRef">
          <div
            ref="_myRef"
            class="custom_ceil"
            v-if="props.column.field == 'user'"
          >
            <span
              v-if="props.row.user_id == 'Organization'"
              class="organization_ceil"
            >
              {{ props.row.user }}
            </span>

            <span v-if="props.row.fired" class="fired_ceil">
              {{ props.row.user }}
            </span>
            <span
              v-if="props.row.user_id !== 'Organization' && !props.row.fired"
            >
              {{ props.row.user }}
            </span>
          </div>
          <div class="custom_ceil" v-if="props.column.field == 'user_distr'">
            <span
              v-if="props.row.user_id == 'Organization'"
              class="organization_ceil"
            >
              {{ props.row.user_distr }}
            </span>
            <span v-else-if="props.row.fired" class="fired_ceil">
              {{ props.row.user_distr }}
            </span>
            <span v-else>
              {{ props.row.user_distr }}
            </span>
          </div>
          <div class="custom_ceil" v-if="props.column.field == 'user_income'">
            <span
              v-if="props.row.user_id == 'Organization'"
              class="organization_ceil"
            >
              {{ props.row.user_income }}
            </span>
            <span v-else-if="props.row.fired" class="fired_ceil">
              {{ props.row.user_income }}
            </span>
            <span v-else>
              {{ props.row.user_income }}
            </span>
          </div>
          <div class="custom_ceil" v-if="props.column.field == 'user_total'">
            <span
              v-if="props.row.user_id == 'Organization'"
              class="organization_ceil"
            >
              {{ props.row.user_total }}
            </span>
            <span v-else-if="props.row.fired" class="fired_ceil">
              {{ props.row.user_total }}
            </span>
            <span v-else>
              {{ props.row.user_total }}
            </span>
          </div>
        </template>
      </vue-good-table>
    </div>
    <div class="content_loading" v-if="!stopFetching">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";
import { organizationSettingsStore } from "@/store/organization-settings";

import DownloadIcon from "@/components/Icons/download.vue";
import SearchInput from "./CommonComponents/SearchInput/SearchInput.vue";
import FilterByOrganization from "./CommonComponents/FilterByOrganization/FilterByOrganization.vue";

import "vue-good-table-next/dist/vue-good-table-next.css";

export default {
  name: "AnalyticsBalance",
  components: {
    DownloadIcon,
    SearchInput,
    FilterByOrganization,
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
      downloadPending: false,
      organizationName: "",
      organizationBalance: "",
      showFired: false,

      rows: [],
      stopFetching: false,
      departmentListForRequest: [],
      searchByUserString: "",
      currentSortDetails: {},
      offset: 1,
      limit: 100,
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    columns() {
      return [
        {
          label: this.$t("analyticsPage.adminAnalytics.balance.user"),
          field: "user",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.balance.balanceDistribution"
          ),
          field: "user_distr",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.balance.balanceReceivedBonuses"
          ),
          field: "user_income",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t("analyticsPage.adminAnalytics.balance.totalAmount"),
          field: "user_total",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
      ];
    },
  },
  watch: {},
  methods: {
    async getTransactions() {
      try {
        let params = {
          org_id: this.profileInfo.profile.organization_id,
        };
        let response = await axios.get(API_URIS.transactionsAccounts, {
          params,
        });
        this.organizationName = this.profileInfo.profile.organization;
        this.organizationBalance = response.data.data.find(
          (el) => el.type == "D"
        )?.amount;
      } catch (err) {
        throw err;
      }
    },
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    async downloadExcel() {
      try {
        let params = {
          offset: this.offset,
          limit: this.limit,
          fired: this.showFired ? 1 : 0,
        };
        if (this.currentSortDetails) {
          params.desc = this.currentSortDetails.desc;
          params.sort_by = this.currentSortDetails.sort_by;
        }
        if (this.searchByUserString) {
          params.search = this.searchByUserString;
        }
        if (this.departmentListForRequest.length) {
          params.departments = this.departmentListForRequest.join(",");
        }
        this.downloadPending = true;
        let response = await axios.get(API_URIS.adminAnalyticsBalanceXlsx, {
          params,
          responseType: "arraybuffer",
        });
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        let xlsxUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = xlsxUrl;
        let currentDate = new Date();
        currentDate = new Intl.DateTimeFormat("ru").format(currentDate);
        link.download = `${this.$t(
          "analyticsPage.adminAnalytics.balance.balanceFileName"
        )} (${this.organizationSettings.settings.name}) ${currentDate}.xlsx`;
        link.click();
        this.downloadPending = false;
      } catch (err) {
        this.downloadPending = false;
        throw err;
      }
    },
    getNoun(number) {
      let n = Math.abs(number);
      n %= 100;
      if (n >= 5 && n <= 20) {
        return this.organizationSettings.settings.bonusname.RU.form4;
      }
      n %= 10;
      if (n === 1) {
        return this.organizationSettings.settings.bonusname.RU.form1;
      }
      if (n >= 2 && n <= 4) {
        return this.organizationSettings.settings.bonusname.RU.form5;
      }
      return this.organizationSettings.settings.bonusname.RU.form4;
    },

    async getBalance() {
      if (!this.stopFetching) {
        try {
          let params = {
            offset: this.offset,
            limit: this.limit,
            fired: this.showFired ? 1 : 0,
          };
          if (this.currentSortDetails) {
            params.desc = this.currentSortDetails.desc;
            params.sort_by = this.currentSortDetails.sort_by;
          }
          if (this.searchByUserString) {
            params.search = this.searchByUserString;
          }
          if (this.departmentListForRequest.length) {
            params.departments = this.departmentListForRequest.join(",");
          }
          let response = await axios.get(API_URIS.adminAnalyticsBalance, {
            params,
          });

          if (this.offset == 1) {
            this.rows = response.data.details;
          } else {
            this.rows.push(...response.data.details);
          }
          if (this.offset == 1 && response.data.organization) {
            this.rows.unshift({
              user_id: "Organization",
              user: this.$t(
                "analyticsPage.adminAnalytics.balance.commonBalance"
              ),
              user_distr: response.data.organization.total_distr,
              user_income: response.data.organization.total_income,
              user_total: response.data.organization.total,
            });
          }
          if (response.data.details.length < this.limit) {
            this.stopFetching = true;
          }
          this.offset += 1;
        } catch (err) {
          throw err;
        }
      }
    },
    getWithFired() {
      this.stopFetching = false;
      this.offset = 1;
      this.limit = 100;
      this.rows = [];
      this.getBalance();
    },

    setDepartmentListForRequest(list) {
      this.stopFetching = false;
      this.departmentListForRequest = [...list];
      this.offset = 1;
      this.limit = this.departmentListForRequest.length ? 1000 : 100;
      this.rows = [];
      this.getBalance();
    },
    searchByUser(searchString) {
      this.stopFetching = false;
      this.searchByUserString = searchString;
      this.offset = 1;
      this.limit = searchString ? 1000 : 100;
      this.rows = [];
      this.getBalance();
    },
    onSortChange(sortDetails) {
      let formattedSortDetails = {};
      if (sortDetails[0].type == "asc") {
        formattedSortDetails = {};
      } else if (sortDetails[0].type == "desc") {
        formattedSortDetails.desc = true;
      }
      formattedSortDetails.sort_by = sortDetails[0].field;
      if (sortDetails[0].type == "none") {
        formattedSortDetails = {};
      }
      if (
        this.currentSortDetails?.type !== sortDetails[0].type ||
        this.currentSortDetails.sort_by !== sortDetails[0].field
      ) {
        this.offset = 1;
        this.limit = 100;
        this.stopFetching = false;
      }
      this.currentSortDetails = formattedSortDetails;

      this.getBalance();
    },
  },
  mounted() {
    this.getTransactions();
    this.getBalance();

  },
};
</script>

<style  >
.analytics_balance {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
}
.table_filters {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
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
._org_name {
  font-family: "Golos";
  font-size: 28px;
  font-weight: 700;
  line-height: 36px;
  letter-spacing: 0px;
  text-align: left;
  color: var(--generalContrast);
  margin: 0;
  cursor: default;
}
.fired_users_switcher {
  display: flex;
  gap: 8px;
  align-items: center;
}
.fired_users_switcher_title {
  font-family: "Golos";
  font-size: 18px;
  font-weight: 400;
  color: var(--generalContrast);
  margin: 0;
}
._switch {
  margin: 6px 0 0 0;
}
.table_wrapper {
  width: 100%;
}
.user_ceil {
  display: flex;
  align-items: center;
  gap: 15px;
}
.user_ceil_photo {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 100%;
  object-fit: cover;
}
.user_ceil_name {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  color: var(--generalContrast);
}
.organization_ceil {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  text-align: left;
  color: var(--generalContrast);
  cursor: default;
}
.fired_ceil {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  text-align: left;
  color: var(--surveyGraphNotCompleted) !important;
  cursor: default;
}
._fired {
  background-color: var(--surveyGraphNotCompleted) !important;
}
</style>