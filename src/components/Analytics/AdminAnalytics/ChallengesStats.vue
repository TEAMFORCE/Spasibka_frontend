<template>
  <div class="analytics_challenges_stats" ref="scrollContainer">
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
        :placeholder="
          $t('analyticsPage.adminAnalytics.challengesStats.createdAt')
        "
        @dateChanged="startDateChanged"
      />
      <FilterByDate
        :placeholder="$t('analyticsPage.adminAnalytics.challengesStats.endAt')"
        @dateChanged="endDateChanged"
      />
      <FilterByChallengeStateMultipleChoice
        @departmentChecked="challengeStateChanged"
      />
    </div>
    <div class="table_wrapper" v-if="rows.length">
      <vue-good-table
        ref="vgt"
        mode="remote"
        styleClass="vgt-table"
        :rows="rows"
        :columns="columns"
        :lineNumbers="true"
        @sort-change="onSortChange"
      >
        <template #table-row="props">
          <div class="user_ceil" v-if="props.column.field == 'photo'">
            <img
              v-if="props.row.photos"
              :src="getAvatar(props.row.photos[0] + '?thumbnail=1')"
              alt="user_photo"
              class="user_ceil_photo"
            />
            <img
              v-else-if="props.row.photo"
              :src="getAvatar(props.row.photo)"
              alt="user_photo"
              class="user_ceil_photo"
            />
            <img
              v-else
              :src="getImgUrl('userNoPhoto')"
              alt="user_photo"
              class="user_ceil_photo"
            />
          </div>
          <div class="custom_ceil" v-if="props.column.field === 'created_at'">
            {{ formatDate(props.row.created_at) }}
          </div>
          <div class="custom_ceil" v-if="props.column.field === 'end_at'">
            {{ formatDate(props.row.end_at) }}
          </div>
        </template>
      </vue-good-table>
    </div>
    <div class="content_loading" v-if="isLoading">
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
import FilterByChallengeState from "./CommonComponents/FilterByChallengeState/FilterByChallengeState.vue";
import FilterByDate from "./CommonComponents/FilterByDate/FilterByDate.vue";
import BarChartChallenges from "./Diagrams/BarChartChallenges";

import "vue-good-table-next/dist/vue-good-table-next.css";
import { formatTimestamp } from "@/general-scripts/timestamps";
import FilterByChallengeStateMultipleChoice from "./CommonComponents/FilterByChallengeState/FilterByChallengeStateMultipleChoice.vue";

export default {
  name: "ChallengesStats",
  components: {
    DownloadIcon,
    FilterByOrganization,
    BarChartChallenges,
    FilterByChallengeState,
    FilterByDate,
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
    FilterByChallengeStateMultipleChoice,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
      startDate: null,
      endDate: null,
      currentFieldName: null,
      currentOrder: null,
      stopFetching: false,
      isLoading: false,
      downloadPending: false,
      rows: [],
      selectedChallengeStates: [],
      limit: 30,
      offset: 1,
    };
  },
  computed: {
    columns() {
      return [
        // {
        //   label: this.$t("analyticsPage.adminAnalytics.challengesStats.photo"),
        //   field: "photo",
        //   sortable: false,
        //   tdClass: "vgt-left-align",
        //   thClass: "vgt-left-align",
        //   width: "50px",
        // },
        {
          label: this.$t("analyticsPage.adminAnalytics.challengesStats.name"),
          field: "name",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "300px",
        },
        {
          label: this.$t("analyticsPage.adminAnalytics.challengesStats.author"),
          field: "author",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "150px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.challengesStats.prizeFund"
          ),
          field: "start_balance",
          sortable: true,
          tdClass: "text-centered",
          thClass: "vgt-left-align",
          width: "75px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.challengesStats.participantsCount"
          ),
          field: "participants_count",
          sortable: true,
          tdClass: "text-centered",
          thClass: "vgt-left-align",
          width: "85px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.challengesStats.prizePlaces"
          ),
          field: "number_of_prizes",
          sortable: true,
          tdClass: "text-centered",
          thClass: "vgt-left-align",
          width: "105px",
        },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.challengesStats.winnersCount"
          ),
          field: "winners_count",
          sortable: true,
          tdClass: "text-centered",
          thClass: "vgt-left-align",
          width: "95px",
        },
        // {
        //   label: this.$t(
        //     "analyticsPage.adminAnalytics.challengesStats.execStatus"
        //   ),
        //   field: "exec_status",
        //   sortable: true,
        //   tdClass: "text-center",
        //   thClass: "vgt-left-align",
        //   width: "80px",
        // },
        // {
        //   label: this.$t(
        //     "analyticsPage.adminAnalytics.challengesStats.winnerMethod"
        //   ),
        //   field: "winner_method",
        //   sortable: true,
        //   tdClass: "vgt-left-align",
        //   thClass: "vgt-left-align",
        //   width: "100px",
        // },
        {
          label: this.$t(
            "analyticsPage.adminAnalytics.challengesStats.createdAt"
          ),
          field: "created_at",
          sortable: true,
          tdClass: "text-centered",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t("analyticsPage.adminAnalytics.challengesStats.endAt"),
          field: "end_at",
          sortable: true,
          tdClass: "text-centered",
          thClass: "vgt-left-align",
          width: "100px",
        },
        // {
        //   label: this.$t(
        //     "analyticsPage.adminAnalytics.challengesStats.account"
        //   ),
        //   field: "account",
        //   sortable: true,
        //   tdClass: "vgt-left-align",
        //   thClass: "vgt-left-align",
        //   width: "100px",
        // },
      ];
    },
  },
  methods: {
    formatDate(date) {
      let dateObject = formatTimestamp(date);
      let day = (dateObject.day > 9 ? "" : "0") + dateObject.day;
      let month = (dateObject.month > 8 ? "" : "0") + (dateObject.month + 1);
      return day + "." + month + "." + dateObject.year;
    },
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    startDateChanged(date) {
      this.startDate = date;
      this.stopFetching = false;
      this.offset = 1;
      this.getChallengesStats();
    },
    endDateChanged(date) {
      this.endDate = date;
      this.stopFetching = false;
      this.offset = 1;
      this.getChallengesStats();
    },
    handleScrollEnd() {
      if (!this.stopFetching && !this.isLoading) {
        this.getChallengesStats();
      }
    },
    onSortChange(sortDetails) {
      this.currentFieldName = sortDetails[0].field;
      this.currentOrder = sortDetails[0].type;
      this.stopFetching = false;
      this.offset = 1;
      this.getChallengesStats();
    },
    async getChallengesStats() {
      try {
        this.isLoading = true;
        let params = {
          limit: this.limit,
          offset: this.offset,
        };
        if (this.currentFieldName) {
          if (this.currentOrder === "asc") {
            params.sort_by = this.currentFieldName;
          } else if (this.currentOrder === "desc") {
            params.sort_by = this.currentFieldName;
            params.desc = true;
          }
        }
        if (this.startDate) {
          params.start_at = this.startDate;
        }
        if (this.endDate) {
          params.end_at = this.endDate;
        }
        if (this.selectedChallengeStates.length) {
          params.states = this.selectedChallengeStates.join(",");
        }
        let response = await axios.get(API_URIS.adminAnalyticsChallenges, {
          params,
        });
        if (this.offset === 1) {
          this.rows = response.data.details;
        } else {
          this.rows.push(...response.data.details);
        }
        if (response.data.details.length < this.limit) {
          this.stopFetching = true;
        }
        this.offset++;
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        throw err;
      }
    },
    async downloadExcel() {
      try {
        this.downloadPending = true;
        let params = {};
        if (this.currentFieldName) {
          if (this.currentOrder === "asc") {
            params.sort_by = this.currentFieldName;
          } else if (this.currentOrder === "desc") {
            params.sort_by = this.currentFieldName;
            params.desc = true;
          }
        }
        if (this.startDate) {
          params.start_at = this.startDate.toISOString().slice(0, 10);
        }
        if (this.endDate) {
          params.end_at = this.endDate.toISOString().slice(0, 10);
        }
        if (this.selectedChallengeStates.length) {
          params.states = this.selectedChallengeStates.join(",");
        }
        let response = await axios.get(API_URIS.adminAnalyticsChallengesXlsx, {
          responseType: "arraybuffer",
          params: params,
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
          "analyticsPage.adminAnalytics.challengesStats.challengesStatsFileName"
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
        return `${SERVER_IP}${url.replace(/(\.[^/.]+)$/, "_thumb$1")}`;
      }
    },
    challengeStateChanged(selectedStates) {
      this.selectedChallengeStates = selectedStates;
      this.stopFetching = false;
      this.offset = 1;
      this.getChallengesStats();
    },
    // stateCleared() {
    //   this.selectedChallengeStates = null;
    //   this.getChallengesStats();
    // },
    getDateTime(date) {
      if (date) {
        let formattedDate = new Date(date).toLocaleDateString("ru-RU");
        return formattedDate;
      }
      return;
    },
  },
  mounted() {
    this.getChallengesStats();
  },
};
</script>

<style scoped>
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
::v-deep(.text-centered) {
  text-align: center;
  position: relative;
}
::v-deep(.vgt-left-align) {
  position: relative !important;
  vertical-align: middle;
}
::v-deep(.vgt-left-align span) {
  color: var(--generalContrast) !important;
  font-family: "Golos" !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
::v-deep(.vgt-responsive) {
  overflow-y: visible;
}
::v-deep(.vgt-table) {
  border: none !important;
}
::v-deep(thead) {
  position: sticky !important;
  top: 0 !important;
}

.analytics_challenges_stats {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
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
.table_filters {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
}
.table_wrapper {
  width: 100% !important;
  position: relative;
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
::v-deep(.line-numbers) {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  color: var(--generalContrast) !important;
  padding-right: 40px !important;
  background: none !important;
  border-bottom: 1px solid #dcdfe6;
  border-right: none !important;
}
.activity_ceil {
  font-family: "Golos";
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  color: var(--generalContrast);
}
</style>
