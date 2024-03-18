<template>
  <div class="analytics_activity_index">
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
      <FilterByDate
        :id="'startDate'"
        width="200px"
        :placeholder="
          $t('analyticsPage.adminAnalytics.activityIndex.periodStart')
        "
        @dateChanged="startDateChanged"
      />
      <FilterByDate
        :id="'endDate'"
        width="200px"
        :placeholder="
          $t('analyticsPage.adminAnalytics.activityIndex.periodEnd')
        "
        @dateChanged="endDateChanged"
      />
      <FilterByOrganization
        width="360px"
        @departmentChecked="setDepartmentListForRequest"
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
      />
    </div>
    <div class="content_loading" v-if="!stopFetching">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { organizationSettingsStore } from "@/store/organization-settings";

import DownloadIcon from "@/components/Icons/download.vue";
import FilterByDate from "./CommonComponents/FilterByDate/FilterByDate.vue";
import FilterByOrganization from "./CommonComponents/FilterByOrganization/FilterByOrganization.vue";

import "vue-good-table-next/dist/vue-good-table-next.css";

export default {
  name: "AnalyticsActivityIndex",
  components: {
    DownloadIcon,
    FilterByDate,
    FilterByOrganization,
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),

      downloadPending: false,
      stopFetching: false,
      rows: [],
      departmentListForRequest: [],
      currentSortDetails: {},
      startDate: "",
      endDate: "",
      offset: 1,
      limit: 30,
    };
  },
  computed: {
    valueName() {
      return this.organizationSettings.settings.bonusname.RU.form4;
    },
    columns() {
      return [
        {
          label: this.$t("analyticsPage.reports.gridByRating.place"),
          field: "dep_id",
          width: "50px",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.activityIndex.department"
          ),
          field: "name",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.activityIndex.activityIndexByDepartment"
          ),
          field: "rating",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: `${this.$t(
            "analyticsPage.adminAnalytics.activityIndex.received"
          )} ${this.valueName}`,
          field: "received_thanks",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: `${this.$t(
            "analyticsPage.adminAnalytics.activityIndex.sended"
          )} ${this.valueName}`,
          field: "sent_thanks",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.activityIndex.receivedTransaction"
          ),
          field: "received_transactions",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.activityIndex.sendedTransaction"
          ),
          field: "sent_transactions",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.activityIndex.challengeContribution"
          ),
          field: "sent_to_challenges",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.activityIndex.createdChallenges"
          ),
          field: "count_challenges",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.activityIndex.challengeAwwards"
          ),
          field: "received_from_challenges",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.activityIndex.challengeParticipation"
          ),
          field: "participated_in_challenges",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t("analyticsPage.reports.gridByRating.surveyPassed"),
          field: "questionnaires_finished",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
      ];
    },
  },
  watch: {
    rows() {
      this.currentRows = this.rows;
      for (let i = 0; i < this.currentRows.length; i++) {
        this.currentRows[i].dep_id = i + 1;
      }
    },
  },
  methods: {
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    async downloadExcel() {
      try {
        this.downloadPending = true;
        let params = {
          sort_by: "rating",
          desc: true,
          desc: true,
          sort_by: "rating",
        };
        if (Object.keys(this.currentSortDetails).length) {
          params.desc = this.currentSortDetails.desc;
          params.sort_by = this.currentSortDetails.sort_by;
        }
        if (this.startDate) {
          params.fromdate = this.startDate;
        }
        if (this.endDate) {
          params.todate = this.endDate;
        }
        if (this.departmentListForRequest.length) {
          params.department = this.departmentListForRequest.join(",");
        }
        let response = await axios.get(
          API_URIS.adminAnalyticsUserActivityDepartmentXlsx,
          { params, responseType: "arraybuffer" }
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
          "analyticsPage.adminAnalytics.activityIndex.activityIndexFileName"
        )} (${this.organizationSettings.settings.name}) ${currentDate}.xlsx`;
        link.click();

        this.downloadPending = false;
      } catch (err) {
        this.downloadPending = false;
        throw err;
      }
    },
    startDateChanged(date) {
      this.startDate = date;
      this.stopFetching = false;
      this.offset = 1;
      this.limit = 30;
      this.rows = [];
      this.getActivityIndex();
    },
    endDateChanged(date) {
      this.endDate = date;
      this.stopFetching = false;
      this.offset = 1;
      this.limit = 30;
      this.rows = [];
      this.getActivityIndex();
    },
    setDepartmentListForRequest(list) {
      this.stopFetching = false;
      this.departmentListForRequest = [...list];
      this.offset = 1;
      this.limit = this.departmentListForRequest.length ? 1000 : 30;
      this.rows = [];
      this.getActivityIndex();
    },
    async getActivityIndex() {
      if (!this.stopFetching) {
        try {
          let params = {
            sort_by: "rating",
            desc: true,
            offset: this.offset,
            limit: this.limit,
          };
          if (Object.keys(this.currentSortDetails).length) {
            params.desc = this.currentSortDetails.desc;
            params.sort_by = this.currentSortDetails.sort_by;
          }
          if (this.startDate) {
            params.fromdate = this.startDate;
          }
          if (this.endDate) {
            params.todate = this.endDate;
          }
          if (this.departmentListForRequest.length) {
            params.department = this.departmentListForRequest.join(",");
          }
          let response = await axios.get(
            API_URIS.adminAnalyticsUserActivityDepartment,
            { params }
          );
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
        this.limit = 30;
        this.stopFetching = false;
      }
      this.currentSortDetails = formattedSortDetails;
      this.getActivityIndex();
    },
  },
  mounted() {
    this.getActivityIndex();
  },
};
</script>

<style scoped>
::v-deep(.text-center) {
  text-align: center !important;
  position: relative !important;
  bottom: 10px !important;
}
::v-deep(.vgt-table th.sortable button:before) {
  left: 10px;
}
::v-deep(.vgt-table th.sortable button:after) {
  left: 10px;
}
::v-deep(.vgt-table th.sortable span:not(.sr-only)) {
  position: relative;
  left: 20px;
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: var(--generalContrast);
}
::v-deep(.vgt-table thead) {
  z-index: 100;
}
::v-deep(.vgt-table thead th) {
  background: var(--generalColorWhite);
  vertical-align: inherit;
  color: var(--generalContrast) !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 18px !important;
}
::v-deep(.vgt-left-align) {
  position: relative;
}
::v-deep(.vgt-left-align span) {
  color: var(--generalContrast) !important;
  font-family: "Golos" !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
::v-deep(.vgt-responsive) {
  width: 100% !important;
  /* overflow-x: hidden; */
  overflow-y: auto;
}
::v-deep(.vgt-table) {
  border: none !important;
}
/*  */
/*  */
.analytics_activity_index {
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
</style>