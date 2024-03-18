<template>
  <div class="items_table_wrapper" ref="scrollContainer">
    <div class="items_table_control">
      <input
        type="text"
        class="search_field general-contrast-color"
        :placeholder="$t('market.search')"
        v-model="searchString"
      />
      <button
        v-if="isReportPurchaseLoading"
        class="download_excel brand-secondary-bg general-brand-color"
      >
        {{ $t("market.report_is_loading") }}
      </button>
      <button v-else class="download_excel" @click="downloadPurchaseExcel">
        <DownloadReportIcon class="top_bar_icon" />
        {{ $t("market.download_as_excel_purchase") }}
      </button>

      <button
        v-if="isReportPurchaseHistoryLoading"
        class="download_excel brand-secondary-bg general-brand-color"
      >
        {{ $t("market.report_is_loading") }}
      </button>
      <button
        v-else
        class="download_excel"
        @click="downloadPurchaseHistoryExcel"
      >
        <DownloadReportIcon class="top_bar_icon" />
        {{ $t("market.download_as_excel_history") }}
      </button>
    </div>
    <Loading
      class="spinner_loader"
      :active="getStatsLock"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <div class="items_table">
      <vue-good-table
        ref="vgt"
        mode="remote"
        @sort-change="onSortChange"
        styleClass="vgt-table"
        :columns="columns"
        :rows="rows"
      >
        <template #table-row="props">
          <div
            class="user_ceil"
            v-if="props.column.field == 'user'"
            @click="openProfile(props.row)"
          >
            <img
              v-if="props.row.user.photo"
              :src="getAvatar(props.row.user.photo)"
              alt="user_photo"
              class="user_ceil_photo"
            />
            <img
              v-else
              :src="getImgUrl('userNoPhoto')"
              alt="user_no_photo"
              class="user_ceil_photo"
            />
            <span class="user_ceil_name">
              {{
                props.row.user.name
                  ? props.row.user.surname +
                    " " +
                    props.row.user.name +
                    " " +
                    props.row.user.middle_name
                  : props.row.user.tg_name
                  ? props.row.user.tg_name
                  : props.row.user.nickname
              }}
            </span>
          </div>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { SERVER_IP, API_URIS } from "@/constants/api";
import { organizationSettingsStore } from "@/store/organization-settings";

import "vue-good-table-next/dist/vue-good-table-next.css";

import DownloadReportIcon from "@/components/Icons/MarketIcons/DownloadReportIcon.vue";
import Loading from "vue3-loading-overlay";

export default {
  name: "ReportByMarketPurchaseStats",
  components: {
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
    DownloadReportIcon,
    Loading,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),

      statsOrderBy: null,
      pageCount: 1,
      searchString: "",
      rows: [],
      isReportPurchaseLoading: false,
      isReportPurchaseHistoryLoading: false,

      getStatsLock: false,
      reachedEnd: false,
      searchStastTimeout: null,

      marketID: null,

      orderBy: "",

      currentSortDetails: null,
    };
  },
  computed: {
    columns() {
      let columns = [
        {
          label: this.$t("analyticsPage.reports.gridByMarketStats.user"),
          field: "user",
          width: "200px",
          sortable: true,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByMarketStats.countOfOrders"
          ),
          field: "order_count",
          width: "50px",
          sortable: true,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByMarketStats.valueOfBonuses"
          ),
          field: "currency_spent",
          width: "50px",
          sortable: true,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByMarketStats.countOfReceivedBenefits"
          ),
          field: "benefit_get_amount",
          width: "50px",
          sortable: true,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByMarketStats.countOfCanceledBenefits"
          ),
          field: "benefit_refuse_amount",
          width: "50px",
          sortable: true,
          type: "number",
          tdClass: "text-center",
          thClass: "vgt-left-align",
        },
      ];
      return columns;
    },
  },
  watch: {
    getStatsLock: {
      handler(newVal) {
        if (newVal) {
          this.positionLoader();
        }
      },
    },
    searchString: {
      handler() {
        this.fetchStatsWithSearch();
      },
      flush: "post",
    },
  },
  methods: {
    openProfile(row) {
      if (row?.user?.user_id) {
        this.$router.push({
          path: "/other_profile/" + row.user.user_id,
          query: { prev: "rating" },
        });
      }
    },
    positionLoader() {
      const el = this.$refs.scrollContainer;
      const rect = el.getBoundingClientRect();

      const loaderEl = this.$refs.spinnerLoader.$el;
      loaderEl.style.position = "fixed";
      loaderEl.style.top = `${rect.top}px`;
      loaderEl.style.left = `${rect.left}px`;
      loaderEl.style.width = `${rect.width}px`;
      loaderEl.style.height = `${rect.height}px`;
    },
    addScrollEndEvent() {
      var table = document.getElementsByClassName("analytics_page_reports")[0];
      table.addEventListener("scroll", () => {
        if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
          this.scrolledToBottom();
        }
      });
    },
    scrolledToBottom() {
      if (!this.getStatsLock) {
        this.getStats();
      }
    },
    fetchStatsWithSearch() {
      if (this.searchStastTimeout) {
        clearTimeout(this.searchStastTimeout);
      }
      this.searchStastTimeout = setTimeout(this.resetStats, 800);
    },
    getAvatar(url) {
      if (url) {
        return `${SERVER_IP}${url}`;
      }
    },
    getImgUrl(imageName) {
      var images = require.context("@/assets/", false, /\.png$/);
      return images("./" + imageName + ".png");
    },
    resetStats() {
      this.reachedEnd = false;
      this.rows = [];
      this.pageCount = 1;
      this.currentSortDetails = null;
      this.getStats();
    },
    onSortChange(sortDetails) {
      this.reachedEnd = false;
      this.rows = [];
      this.pageCount = 1;
      this.currentSortDetails = sortDetails;
      this.getStats(this.currentSortDetails);
    },
    async getAvailableMarkets() {
      try {
        const response = await axios.get(API_URIS.marketsAvailable);
        if (response.data.length > 0) {
          this.marketID = response.data[0].id;
        }
      } catch (err) {
        throw err;
      }
    },
    async getStats() {
      try {
        this.getStatsLock = true;
        let params = {
          offset: this.pageCount,
          limit: 20,
          desc: 1,
        };
        if (this.currentSortDetails) {
          params.order_by = this.currentSortDetails[0].field;
          if (this.currentSortDetails[0].type == "desc") {
            params.desc = 1;
            this.orderBy = this.currentSortDetails[0].field;
          } else if (this.currentSortDetails[0].type !== "desc") {
            params.desc = 0;
            this.orderBy = this.currentSortDetails[0].field;
          }
        }
        if (this.searchString.trim() != "") {
          params["search_name"] = this.searchString.trim();
        }
        const response = await axios.get(API_URIS.marketAnalyticsBenefit, {
          params,
        });
        this.pageCount++;
        for (let i = 0; i < response.data.details.length; i++) {
          this.rows.push(response.data.details[i]);
        }
        this.getStatsLock = false;
      } catch (error) {
        this.getStatsLock = false;
        throw error;
      }
    },
    async downloadPurchaseExcel() {
      try {
        this.isReportPurchaseLoading = true;
        let params = {
          limit: 5000,
          offset: 0,
        };
        if (this.searchString.trim() != "") {
          params["search_name"] = this.searchString.trim();
        }
        const response = await axios.get(API_URIS.marketAnalyticsBenefitExcel, {
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
        link.download = `${this.$t("market.market_order_stats")} (${
          this.organizationSettings.settings.name
        }) ${currentDate}.xlsx`;
        link.click();
        this.isReportPurchaseLoading = false;
      } catch (error) {
        this.isReportPurchaseLoading = false;
        throw error;
      }
    },
    async downloadPurchaseHistoryExcel() {
      let requestObject = {
        ext: "xlsx",
        limit: 10000,
        offset: 1,
      };
      try {
        this.isReportPurchaseHistoryLoading = true;
        let response = await axios.post(
          API_URIS.marketAdminOrders.replace("id", this.marketID),
          requestObject,
          {
            responseType: "arraybuffer",
          }
        );
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        let xlsxUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = xlsxUrl;
        let currentDate = new Date();
        currentDate = new Intl.DateTimeFormat("ru").format(currentDate);
        link.download = `${this.$t("market.market_orders")}  (${
          this.organizationSettings.settings.name
        }) ${currentDate}.xlsx`;
        link.click();
        this.isReportPurchaseHistoryLoading = false;
      } catch (err) {
        this.isReportPurchaseHistoryLoading = false;
        throw err;
      }
    },
  },
  mounted() {
    this.addScrollEndEvent();
    this.getStats();
    this.getAvailableMarkets();
  },
};
</script>

<style scoped>
::v-deep(.text-center) {
  text-align: center !important;
}
.spinner_loader {
  z-index: 10001000 !important;
}
.items_table_wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.items_table_control {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.search_field {
  min-width: 200px;
  width: 100%;
  border-style: none;
  background-color: var(--generalColorWhite);
  border: 1px solid var(--generalColorGrey);
  border-radius: 12px;
  padding: 7px 16px;
  height: 40px;
  box-sizing: border-box;
}
.download_excel {
  height: 40px;
  padding: 8px 14px;
  background-color: var(--generalBrand);
  box-shadow: 0px 10px 20px rgba(var(--generalBrandRGB), 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: "Roboto";
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  white-space: nowrap;
  box-sizing: border-box;
  color: var(--generalColorWhite);
}
.download_report_icon {
  height: 24px;
}
.search .items_table {
  width: 100%;
}
.user_ceil {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
}
.user_ceil_photo {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 100%;
  object-fit: cover;
}
.user_ceil_name {
  color: var(--generalContrast);
  font-family: "Golos" !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
</style>