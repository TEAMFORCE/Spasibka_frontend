<template>
  <div class="items_table_wrapper" ref="scrollContainer">
    <div class="items_table_header">
      <div class="download_excell_wrapper">
        <button
          v-if="downloadPending"
          class="download_excell brand-secondary-bg general-brand-color"
        >
          {{ $t("market.report_is_loading") }}
        </button>
        <button
          v-else
          class="download_excell general-brand-bg"
          @click="downloadExcel"
        >
          <DownloadIcon :currentColor="getIconColor()" />
          {{ $t("market.download_as_excel") }}
        </button>
      </div>
      <SearchInput
        :placeholder="this.$t('market.searchByBenefits')"
        width="360px"
        @searchStringChanged="searchByBenefits"
      />
      <FilterByDate
        :id="'startDate'"
        :placeholder="$t('analyticsPage.reports.gridByMarketGoods.createTime')"
        width="200px"
        @dateChanged="startDateChanged"
      />
      <FilterByDate
        :id="'endDate'"
        :placeholder="$t('analyticsPage.reports.gridByMarketGoods.expireTime')"
        width="200px"
        @dateChanged="endDateChanged"
      />
    </div>
    <div class="items_table_categories" v-if="categories.length">
      <h1 class="category_text">{{ $t("market.filter.categories") }}</h1>
      <div class="selected_categories">
        <button
          class="selected_category"
          v-for="category in categories"
          :class="{
            'general-brand-bg': selectedCategories.includes(category),
            'transparent-bg': !selectedCategories.includes(category),
          }"
          @click="selectCategory(category)"
        >
          <h1
            class="selected_category_name general-contrast-color"
            :class="{
              'general-white-color': selectedCategories.includes(category),
            }"
          >
            {{ category.name }}
          </h1>
        </button>
      </div>
    </div>
    <div class="items_table" v-if="rows.length">
      <vue-good-table
        ref="vgt"
        mode="remote"
        styleClass="vgt-table"
        :rows="rows"
        :columns="columns"
        @sort-change="onSortChange"
      >
        <template #table-row="props">
          <div class="custom_ceil" v-if="props.column.field == 'added_at'">
            {{ formatTimestamp(props.row.added_at) }}
          </div>
          <div class="custom_ceil" v-if="props.column.field == 'categories'">
            {{ setCategories(props.row.categories) }}
          </div>
          <div class="custom_ceil" v-if="props.column.field == 'created_at'">
            {{ formatTimestamp(props.row.created_at) }}
          </div>
          <div class="custom_ceil" v-if="props.column.field == 'actual_to'">
            {{ formatTimestamp(props.row.actual_to) }}
          </div>
          <div class="custom_ceil" v-if="props.column.field == 'status'">
            {{ setStatus(props.row.status) }}
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
import { formatTimestamp } from "@/general-scripts/timestamps";

import { BENEFIT_STATUSES } from "@/infrastructure/data-sources/benefit-statuses";
import { organizationSettingsStore } from "@/store/organization-settings";

import "vue-good-table-next/dist/vue-good-table-next.css";

import DownloadIcon from "@/components/Icons/download.vue";
import SearchInput from "@/components/Analytics/AdminAnalytics/CommonComponents/SearchInput/SearchInput.vue";
import FilterByDate from "@/components/Analytics/AdminAnalytics/CommonComponents/FilterByDate/FilterByDate.vue";

export default {
  name: "ReportByMarketGoods",
  components: {
    DownloadIcon,
    SearchInput,
    FilterByDate,
    "vue-good-table": require("vue-good-table-next").VueGoodTable,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),

      marketID: null,
      selectedCategories: [],
      categories: [],
      downloadPending: false,

      rows: [],
      stopFetching: false,
      searchByBenefitsString: "",
      startDate: "",
      endDate: "",
      currentSortDetails: {},
      offset: 1,
      limit: 30,
    };
  },
  computed: {
    columns() {
      return [
        {
          label: this.$t("analyticsPage.reports.gridByMarketGoods.addedAt"),
          field: "added_at",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "200px",
        },
        {
          label: this.$t("analyticsPage.reports.gridByMarketGoods.author"),
          field: "author",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "300px",
        },

        {
          label: this.$t("analyticsPage.reports.gridByMarketGoods.category"),
          field: "categories",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "200px",
        },
        {
          label: this.$t("analyticsPage.reports.gridByMarketGoods.name"),
          field: "name",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "300px",
        },
        {
          label: this.$t("analyticsPage.reports.gridByMarketGoods.price"),
          field: "price",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByMarketGoods.countOfOrdersByStatusSendDelivered"
          ),
          field: "send_or_delivered",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByMarketGoods.countOfOrdersByStatusConsidered"
          ),
          field: "considered",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t(
            "analyticsPage.reports.gridByMarketGoods.countOfOrdersByStatusDeclined"
          ),
          field: "declined",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        {
          label: this.$t("analyticsPage.reports.gridByMarketGoods.remaining"),
          field: "rest",
          sortable: true,
          tdClass: "text-center",
          thClass: "vgt-left-align",
          width: "100px",
        },
        // {
        //   label: this.$t(
        //     "analyticsPage.reports.gridByMarketGoods.countOfOrdersByStatusPurchased"
        //   ),
        //   field: "purchased",
        //   sortable: true,
        //   tdClass: "vgt-left-align",
        //   thClass: "vgt-left-align",
        //   width: "100px",
        // },
        {
          label: this.$t("analyticsPage.reports.gridByMarketGoods.createTime"),
          field: "created_at",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "200px",
        },
        {
          label: this.$t("analyticsPage.reports.gridByMarketGoods.expireTime"),
          field: "actual_to",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "200px",
        },
        {
          label: this.$t("analyticsPage.reports.gridByMarketGoods.status"),
          field: "status",
          sortable: false,
          tdClass: "vgt-left-align",
          thClass: "vgt-left-align",
          width: "200px",
        },
      ];
    },
    benefitStatuses() {
      return BENEFIT_STATUSES(this);
    },
  },
  methods: {
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    formatTimestamp(timestamp) {
      if (timestamp) {
        let formattedTimeStamp = formatTimestamp(timestamp);

        let day = formattedTimeStamp.day;
        day = day < 10 ? "0" + day : day;
        let month = formattedTimeStamp.month + 1;
        month = month < 10 ? "0" + month : month;
        let year = formattedTimeStamp.year;
        let date = day + "." + month + "." + year;

        return date;
      } else {
        return "";
      }
    },
    setCategories(benefitCategoties) {
      let currentCategories = benefitCategoties
        .map((el) => el.category_name)
        .join(", ");
      return currentCategories;
    },
    setStatus(benefitStatus) {
      return this.benefitStatuses.find((el) => el.status == benefitStatus)
        .title;
    },
    selectCategory(category) {
      if (this.selectedCategories.some((el) => el.id == category.id)) {
        this.selectedCategories = this.selectedCategories.filter(
          (el) => el.id !== category.id
        );
      } else {
        this.selectedCategories.push(category);
      }
      this.stopFetching = false;
      this.offset = 1;
      this.limit = 30;
      this.rows = [];
      this.getOffers();
    },
    searchByBenefits(searchString) {
      this.stopFetching = false;
      this.searchByBenefitsString = searchString;
      this.offset = 1;
      this.limit = searchString ? 1000 : 30;
      this.rows = [];
      this.getOffers();
    },
    startDateChanged(date) {
      this.startDate = date;
      this.stopFetching = false;
      this.offset = 1;
      this.limit = 30;
      this.rows = [];
      this.getOffers();
    },
    endDateChanged(date) {
      this.endDate = date;
      this.stopFetching = false;
      this.offset = 1;
      this.limit = 30;
      this.rows = [];
      this.getOffers();
    },
    async getOffers() {
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
          if (this.selectedCategories.length) {
            params.categories = this.selectedCategories
              .map((el) => el.id)
              .join(",");
          }
          if (this.searchByBenefitsString) {
            params.name = this.searchByBenefitsString;
          }
          if (this.startDate) {
            params.fromdate = this.startDate;
          }
          if (this.endDate) {
            params.todate = this.endDate;
          }
          let response = await axios.get(API_URIS.adminAnalyticsBenefitCafe, {
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
        let response = await axios.get(API_URIS.adminAnalyticsBenefitCafeXlsx, {
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
        link.download = `${this.$t("market.reportFileName")} (${
          this.organizationSettings.settings.name
        })  ${currentDate}.xlsx`;
        link.click();

        this.downloadPending = false;
      } catch (err) {
        this.downloadPending = false;
        throw err;
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
      this.getOffers();
    },
    async getAvailableMarkets() {
      try {
        const response = await axios.get(API_URIS.marketsAvailable);
        if (response.data.length > 0) {
          this.marketID = response.data[0].id;
          this.getCategories();
        }
      } catch (err) {
        throw err;
      }
    },
    async getCategories() {
      try {
        const response = await axios.get(
          API_URIS.marketCategories.replace("id", this.marketID)
        );
        this.categories = response.data;
      } catch (err) {
        throw err;
      }
    },
  },
  mounted() {
    this.getAvailableMarkets();
    this.getOffers();
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
  height: auto !important;
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
  overflow-x: auto;
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

.items_table_wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.items_table_header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
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
.search_field::placeholder {
  color: var(--generalColorSecondary);
}
.items_table_categories {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.category_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  text-align: left;
}
.selected_categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.selected_category {
  border-radius: 12px;
  gap: 6px;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--generalBrand);
}
.selected_category_name {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  word-break: break-word;
}
.items_table {
  position: relative;
  transform: rotateX(180deg);
  width: 100%;
}
::v-deep(.vgt-table) {
  transform: rotateX(180deg) !important;
}
.increased_photo_wrapper {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  z-index: 1000;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
}
.change_photo_button {
  height: 30px;
  width: 30px;
}
.arrow_icon {
  height: 30px;
  width: 30px;
}
.increased_photo {
  max-height: 80%;
  max-width: 70%;
  object-fit: cover;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 24px;
  overflow: hidden;
}
.item_photo_element {
  display: flex;
  gap: 4px;
}
.item_photo_wrapper {
  min-width: 44px;
  height: 44px;
  width: 44px;
}
.item_photo {
  min-width: 42px;
  height: 42px;
  width: 42px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--secondOverlay);
}
.other_photos_info {
  border-radius: 12px;
  height: 44px;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.other_photos_info_text {
  font-family: "Ubuntu";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
}
.sticky_button_wrapper {
  position: absolute !important;
  right: 25px;
}
::v-deep(.vgt-responsive) {
  position: relative;
}
::v-deep(.sticky_button) {
  position: sticky;
  right: 0px;
}
::v-deep(.vgt-left-align) {
  height: 60px;
}
::v-deep(.vgt-left-align span) {
  font-family: "Golos";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
}
.enable_options_button {
  border-radius: 8px;
  padding: 8px;
}
.offer_options_icon {
  height: 24px;
  width: 24px;
}
.option_buttons {
  z-index: 100;
  display: flex;
  right: 0px;
  flex-direction: column;
  gap: 1px;
  position: absolute;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 12px 24px 0px rgba(138, 138, 138, 0.15);
}
.option_button {
  padding: 16px;
}
</style>