<template>
  <div class="analytics_user_activity">
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
      <FilterByOrganization
        width="360px"
        @departmentChecked="setDepartmentListForRequest"
      />
      <FilterActivityType
        @activityTypeChanged="activityTypeChanged"
        @typeCleared="typeCleared"
      />
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
        <template #table-row="props">
          <div class="user_ceil" v-if="props.column.field == 'profile'">
            <img
              v-if="props.row.profile.photo"
              :src="getAvatar(props.row.profile.photo)"
              alt="user_photo"
              class="user_ceil_photo"
            />
            <img
              v-else
              :src="getImgUrl('userNoPhoto')"
              alt="user_photo"
              class="user_ceil_photo"
            />
            <span class="custom_ceil">
              {{ props.row.profile.name }}
            </span>
          </div>
          <div
            class="custom_ceil"
            v-if="props.column.field == 'profile.date_joined'"
          >
            {{ getDateTime(props.row.profile.date_joined) }}
          </div>
          <div
            class="custom_ceil"
            v-if="props.column.field == 'last_activity.last_event_datetime'"
          >
            {{ getDateTime(props.row.last_activity.last_event_datetime) }}
          </div>
          <div
            class="custom_ceil"
            v-if="props.column.field == 'last_activity.last_event_name'"
          >
            {{ props.row.last_activity.last_event_name }}
          </div>
          <div
            class="custom_ceil"
            v-if="props.column.field == 'profile.fired_at'"
          >
            {{ props.row.profile.fired_at }}
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
import { API_URIS, SERVER_IP } from "@/constants/api";
import { organizationSettingsStore } from "@/store/organization-settings";

import DownloadIcon from "@/components/Icons/download.vue";
import FilterByOrganization from "./CommonComponents/FilterByOrganization/FilterByOrganization.vue";
import FilterActivityType from "./CommonComponents/FilterActivityType/FilterActivityType.vue";

import "vue-good-table-next/dist/vue-good-table-next.css";

export default {
  name: "AnalyticsUserActivity",
  components: {
    DownloadIcon,
    FilterByOrganization,
    FilterActivityType,
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
      downloadPending: false,
      rows: [],
      departmentListForRequest: [],
      selectedActivityType: null,

      stopFetching: false,
      currentSortDetails: {},
      offset: 1,
      limit: 30,
    };
  },
  computed: {
    columns() {
      return [
        {
          label: this.$t("analyticsPage.adminAnalytics.userActivity.user"),
          field: "profile",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.userActivity.registrationDate"
          ),
          field: "profile.date_joined",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t("analyticsPage.adminAnalytics.userActivity.date"),
          field: "last_activity.last_event_datetime",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.userActivity.activityTypesPlaceholder"
          ),
          field: "last_activity.last_event_name",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "400px",
        },
        {
          label: this.$t("analyticsPage.adminAnalytics.userActivity.firedAt"),
          field: "profile.fired_at",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "400px",
        },
      ];
    },
  },
  methods: {
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    async getUserActivity() {
      if (!this.stopFetching) {
        try {
          let params = {
            offset: this.offset,
            limit: this.limit,
          };
          if (this.currentSortDetails) {
            params.desc = this.currentSortDetails.desc;
            params.sort_by = this.currentSortDetails.sort_by;
          }
          if (this.selectedActivityType) {
            params.type = this.selectedActivityType;
          }
          if (this.departmentListForRequest.length) {
            params.departments = this.departmentListForRequest.join(",");
          }
          let response = await axios.get(API_URIS.adminAnalyticsUserActivity, {
            params,
          });
          if (this.offset == 1) {
            this.rows = response.data.details;
          } else {
            this.rows.push(...response.data.details);
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
    async downloadExcel() {
      try {
        this.downloadPending = true;
        let response = await axios.get(
          API_URIS.adminAnalyticsUserActivityXlsx,
          { responseType: "arraybuffer" }
        );
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        let xlsxUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = xlsxUrl;
        let currentDate = new Date();
        currentDate = new Intl.DateTimeFormat("ru").format(currentDate);
        link.download = `${this.$t(
          "analyticsPage.adminAnalytics.userActivity.activityFileName"
        )} (${this.organizationSettings.settings.name}) ${currentDate}.xlsx`;
        link.click();

        this.downloadPending = false;
      } catch (err) {
        this.downloadPending = false;
        throw err;
      }
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    getAvatar(url) {
      if (url) {
        return `${SERVER_IP}${url}`;
      }
    },
    setDepartmentListForRequest(list) {
      this.stopFetching = false;
      this.departmentListForRequest = [...list];
      this.offset = 1;
      this.limit = this.departmentListForRequest.length ? 1000 : 30;
      this.rows = [];
      this.getUserActivity();
    },
    activityTypeChanged(type) {
      this.stopFetching = false;
      this.selectedActivityType = type.type;
      this.offset = 1;
      this.limit = this.selectedActivityType ? 1000 : 30;
      this.rows = [];
      this.getUserActivity();
    },
    typeCleared() {
      this.stopFetching = false;
      this.selectedActivityType = null;
      this.offset = 1;
      this.limit = 30;
      this.rows = [];
      this.getUserActivity();
    },
    onSortChange(sortDetails) {
      let formattedSortDetails = {};

      if (sortDetails[0].type == "asc") {
        formattedSortDetails = {};
      } else if (sortDetails[0].type == "desc") {
        formattedSortDetails.desc = true;
      }
      if (sortDetails[0].type == "none") {
        formattedSortDetails = {};
      }

      if (sortDetails[0].field == "last_activity.last_event_datetime") {
        formattedSortDetails.sort_by = "date";
      } else if (sortDetails[0].field == "last_activity.last_event_name") {
        formattedSortDetails.sort_by = "type";
      } else if (sortDetails[0].field == "profile") {
        formattedSortDetails.sort_by = "name";
      }

      if (
        this.currentSortDetails?.type !== sortDetails[0].type ||
        this.currentSortDetails.sort_by !== "date" ||
        this.currentSortDetails.sort_by !== "type" ||
        this.currentSortDetails.sort_by !== "name"
      ) {
        this.offset = 1;
        this.limit = 30;
        this.stopFetching = false;
      }
      this.currentSortDetails = formattedSortDetails;

      this.getUserActivity();
    },
    getDateTime(date) {
      if (date) {
        let formattedDate = new Date(date).toLocaleDateString("ru-RU");
        return formattedDate;
      }
      return;
    },
  },
  mounted() {
    this.getUserActivity();
  },
};
</script>

<style >
.vgt-table th.sortable button:before {
  left: 10px;
}
.vgt-table th.sortable button:after {
  left: 10px;
}
.vgt-table th.sortable span:not(.sr-only) {
  position: relative;
  left: 20px;
}
.vgt-table thead {
  z-index: 100;
}
.vgt-table thead th {
  background: var(--generalColorWhite);
  vertical-align: inherit;
  color: var(--generalContrast) !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 18px !important;
}
.vgt-left-align {
  position: relative;
  color: var(--generalBrand) !important;
  font-family: "Golos" !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
/* .table_wrapper .vgt-left-align span:not(.user_ceil_name) {
  position: absolute;
  transform: translateY(10px);
} */
.vgt-responsive {
  width: 100% !important;
  overflow-x: auto;
  overflow-y: visible;
}
.vgt-table {
  border: none !important;
}
thead {
  position: sticky !important;
  top: 0 !important;
}
/*  */
/*  */

.analytics_user_activity {
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
</style>