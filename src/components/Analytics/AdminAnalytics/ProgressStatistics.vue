<template>
  <div class="analytics_progress_statistics">
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
        :placeholder="
          $t('analyticsPage.adminAnalytics.statsBySurveys.startDateFilterTitle')
        "
        width="200px"
        @dateChanged="startDateChanged"
      />
      <FilterByDate
        :id="'endDate'"
        :placeholder="
          $t('analyticsPage.adminAnalytics.statsBySurveys.endDateFilterTitle')
        "
        width="200px"
        @dateChanged="endDateChanged"
      />
      <FilterByQuestionnaireType @typeListChanged="typeListChanged" />
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
          <div class="custom_ceil" v-if="props.column.field == 'type_int'">
            {{ getType(props.row.type_int) }}
          </div>
          <div class="custom_ceil" v-if="props.column.field == 'started_at'">
            {{ getDate(props.row.started_at) }}
          </div>
          <div class="custom_ceil" v-if="props.column.field == 'finished_at'">
            {{ getDate(props.row.finished_at) }}
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
import { organizationSettingsStore } from "@/store/organization-settings";

import { QUESTIONNAIRE_TYPES } from "@/infrastructure/data-sources/questionnaire-types";

import DownloadIcon from "@/components/Icons/download.vue";
import FilterByDate from "./CommonComponents/FilterByDate/FilterByDate.vue";
import FilterByQuestionnaireType from "./CommonComponents/FilterByQuestionnaireType/FilterByQuestionnaireType.vue";

import "vue-good-table-next/dist/vue-good-table-next.css";

export default {
  name: "AnalyticsProgressStatistics",
  components: {
    DownloadIcon,
    FilterByDate,
    FilterByQuestionnaireType,
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
      downloadPending: false,
      stopFetching: false,
      rows: [],
      currentSortDetails: {},
      currentTypeList: null,
      startDate: "",
      endDate: "",
      offset: 1,
      limit: 30,
    };
  },
  computed: {
    columns() {
      return [
        {
          label: this.$t("analyticsPage.adminAnalytics.statsBySurveys.name"),
          field: "name",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t("analyticsPage.adminAnalytics.statsBySurveys.type"),
          field: "type_int",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.statsBySurveys.startDateFilterTitle"
          ),
          field: "started_at",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.statsBySurveys.endDateFilterTitle"
          ),
          field: "finished_at",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.statsBySurveys.allParticipantsAmount"
          ),
          field: "participant_amount",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.statsBySurveys.completedParticipantsAmount"
          ),
          field: "complited_amount",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
      ];
    },
    questionnaireTypes() {
      return QUESTIONNAIRE_TYPES(this);
    },
  },
  methods: {
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    getType(type) {
      let currentType = this.questionnaireTypes.find((el) => el.type == type);
      return currentType.title;
    },
    getDate(date) {
      if (date) {
        let formattedDate = new Date(date).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return formattedDate;
      }
      return;
    },
    async downloadExcel() {
      try {
        this.downloadPending = true;
        let response = await axios.get(
          API_URIS.adminAnalyticsQuestionnairesXlsx,
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
          "analyticsPage.adminAnalytics.statsBySurveys.statsBySurveysFileName"
        )} (${this.organizationSettings.settings.name}) ${currentDate}.xlsx`;
        link.click();
        this.downloadPending = false;
      } catch (err) {
        this.downloadPending = false;
        throw err;
      }
    },
    async getStatistics() {
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
          if (this.startDate) {
            params.fromdate = this.startDate;
          }
          if (this.endDate) {
            params.todate = this.endDate;
          }
          if (this.currentTypeList) {
            params.type = this.currentTypeList;
          }
          let response = await axios.get(
            API_URIS.adminAnalyticsQuestionnaires,
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
    startDateChanged(date) {
      this.startDate = date;
      this.stopFetching = false;
      this.offset = 1;
      this.limit = 30;
      this.rows = [];
      this.getStatistics();
    },
    endDateChanged(date) {
      this.endDate = date;
      this.stopFetching = false;
      this.offset = 1;
      this.limit = 30;
      this.rows = [];
      this.getStatistics();
    },

    typeListChanged(typeList) {
      if (typeList.length) {
        this.currentTypeList = typeList.join(",");
      } else {
        this.currentTypeList = null;
      }
      this.stopFetching = false;
      this.offset = 1;
      this.limit = 30;
      this.rows = [];
      this.getStatistics();
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
      this.getStatistics();
    },
  },
  mounted() {
    this.getStatistics();
  },
};
</script>

<style scoped>
::v-deep(.text-center) {
  text-align: center !important;
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
  position: relative;
  color: var(--generalContrast) !important;
  font-family: "Golos" !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
::v-deep(.vgt-responsive) {
  width: 100% !important;
  overflow-x: hidden;
  overflow-y: visible;
}
::v-deep(.vgt-table) {
  border: none !important;
}
::v-deep(thead) {
  position: sticky !important;
  top: 0 !important;
}
/*  */
/*  */
.analytics_progress_statistics {
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