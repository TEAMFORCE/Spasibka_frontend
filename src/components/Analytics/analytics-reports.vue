<template>
  <div class="analytics_page_reports" v-scroll-end="handleScrollEnd">
    <div class="analytics_page_reports_filter_header">
      <div class="analytics_page_reports_navigation">
        <div
          v-for="item in analyticsReportsNavigation"
          class="reports_navigation_item"
          @click="changeNav(item)"
        >
          <span
            class="reports_navigation_item_text"
            :class="{ active: item.name === activeNav }"
          >
            {{ item.title }}
          </span>
        </div>
      </div>
      <div
        v-if="isAdmin && showBonusChallengesFilters"
        class="analytics_page_reports_filters"
      >
        <div
          v-for="item in analyticsReportsFilters"
          class="reports_filters_item"
          @click="changeFilter(item)"
        >
          <span
            class="reports_filters_item_text"
            :class="{ active: item.name === activeFilter }"
          >
            {{ getItemTitle(item.title) }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="analytics_page_reports_navigation_market"
      v-if="activeNav == 'market'"
    >
      <div
        class="market_reports_navigation"
        v-for="item in analyticsMarketReportsNavigation"
        @click="changeMarketNavigation(item)"
      >
        <span
          class="reports_navigation_item_text_small"
          :class="{ active: item.name === activeMarketNav }"
        >
          {{ item.title }}
        </span>
      </div>
    </div>
    <div class="activity_index_switcher" v-if="activeNav == 'rating'">
      <h4 class="activity_index_switcher_title">
        {{ $t("analyticsPage.reports.activityIndexSwitch") }}
      </h4>
      <div class="_switch">
        <label class="switch">
          <input type="checkbox" v-model="activityIndexByDepartments" />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
    <div
      class="analytics_page_reports_search_header"
      v-if="
        (activeNav == 'rating' || activeNav == 'detailing') &&
        !activityIndexByDepartments
      "
    >
      <div class="search_by_date">
        <div class="download_button_wrapper" v-if="isAdmin">
          <button
            v-if="downloadPending"
            class="download_button brand-secondary-bg general-brand-color"
            disabled
          >
            {{ $t("analyticsPage.reports.processing") }}
          </button>
          <button
            v-else
            class="download_button general-brand-bg"
            @click="downloadExcel"
          >
            <DownloadIcon :currentColor="getIconColor()" />
            {{ $t("analyticsPage.reports.inputs.uplToExcel") }}
          </button>
        </div>
        <div class="period_selection_options">
          <div class="period_selector">
            <vSelect
              class="style-chooser"
              v-model="selectedPeriod"
              :options="periodList"
              :placeholder="$t('analyticsPage.myPulse.choosePeriod')"
              label="name"
            />
          </div>
          <div class="random_period_selector">
            <div class="random_period">
              <input type="checkbox" class="checkbox" v-model="randomPeriod" />
              <label>
                <span class="category_option_text">
                  {{ $t("analyticsPage.myPulse.randomPeriod") }}
                </span>
              </label>
            </div>
            <Transition>
              <div class="range_period" v-if="randomPeriod">
                <div class="range_input">
                  <Datepicker
                    v-model="dateRangeStart"
                    class="challenge_date_picker"
                    text-input
                    auto-apply
                    format="dd.MM.yyyy"
                    locale="ru"
                    position="left"
                    :clearable="true"
                    :placeholder="$t('analyticsPage.myPulse.dateStart')"
                    :enable-time-picker="false"
                  >
                    <template #clear-icon="{ clear }">
                      <CloseIcon @click="clear" />
                    </template>
                  </Datepicker>
                </div>
                <div class="range_input">
                  <Datepicker
                    v-model="dateRangeEnd"
                    class="challenge_date_picker"
                    text-input
                    auto-apply
                    format="dd.MM.yyyy"
                    locale="ru"
                    position="left"
                    :clearable="true"
                    :placeholder="$t('analyticsPage.myPulse.dateEnd')"
                    :enable-time-picker="false"
                  >
                    <template #clear-icon="{ clear }">
                      <CloseIcon @click="clear" />
                    </template>
                  </Datepicker>
                </div>
                <div class="range_end"></div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
      <div v-if="isAdmin" class="search_by_user">
        <input
          class="search_by_user_input"
          type="text"
          :placeholder="$t('analyticsPage.reports.inputs.searchByUser')"
          v-model="searchByUsername"
          v-debounce:800="searchByUser"
          id="search_by_user_input_one"
        />
        <div class="search_by_user_organization">
          <FilterByOrganization
            v-if="activeNav === 'rating' && activeFilter === 'challenges'"
            @departmentChecked="departmentChecked"
          />
          <vSelect
            v-else-if="activeNav == 'rating'"
            class="style-chooser"
            v-model="selectedOrganizationFilter"
            :options="organizationsList"
            :placeholder="$t('analyticsPage.reports.inputs.searchByUnit')"
            label="name"
            @option:selected="changeOrganization()"
          />
        </div>
      </div>
    </div>
    <div class="analytics_page_reports_grid">
      <ReportsByRating
        v-if="activeNav == 'rating' && !activityIndexByDepartments"
        :rows="ratingRows"
        :isAdmin="isAdmin"
        :selectedFilter="activeFilter"
        @getRating="initialGetRating"
        @onSortChange="onRatingSortChange"
        @scrolledToBottom="ratingScrolledToBottom"
      />
      <ReportsByDetailing
        v-if="activeNav == 'detailing'"
        :rows="detailingRows"
        :isChallengesForDetailing="isChallengesForDetailing"
        @getDetailing="initialGetDetailing"
        @onSortChange="onDetailingSortChange"
        @scrolledToBottom="detailingScrolledToBottom"
      />
      <ReportByMarketGoods
        v-if="activeNav == 'market' && activeMarketNav == 'goods'"
        ref="goods"
      />
      <ReportByMarketPurchaseStats
        v-if="activeNav == 'market' && activeMarketNav == 'purchaseStats'"
      />
      <AnalyticsUserActivity
        v-if="activeNav == 'userActivity'"
        ref="userActivity"
      />
      <ChallengesStats v-if="activeNav === 'challenges'" ref="challenges" />
      <AnalyticsBalance v-if="activeNav == 'balance'" ref="balance" />
      <AnalyticsProgressStatistics
        v-if="activeNav == 'progressStatistics'"
        ref="progressStatistics"
      />
      <AnalyticsActivityIndex
        v-if="activeNav == 'rating' && activityIndexByDepartments"
        ref="activityIndex"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

import axios from "axios";
import { API_URIS } from "@/constants/api";

import { ROLE_TYPE } from "@/infrastructure/constants/role-type";
import { ANALYTICS_REPORTS_NAVIGATION } from "@/infrastructure/data-sources/analytics-reports-navigation";
import { ANALYTICS_REPORTS_FILTERS } from "@/infrastructure/data-sources/analytics-reports-filters";
import { ANALYTICS_MARKET_REPORTS_NAVIGATION } from "@/infrastructure/data-sources/analytics-market-report-navigation";

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

import { vue3Debounce } from "vue-debounce";

import { organizationSettingsStore } from "@/store/organization-settings";

import vSelect from "vue-select";
import Datepicker from "@vuepic/vue-datepicker";
import ReportByMarketGoods from "./Reports/report-by-market-goods.vue";
import ReportByMarketPurchaseStats from "./Reports/report-by-market-purchase-stats.vue";
import CloseIcon from "@/components/Icons/close.vue";
import FilterByOrganization from "./AdminAnalytics/CommonComponents/FilterByOrganization/FilterByOrganization.vue";
import AnalyticsUserActivity from "@/components/Analytics/AdminAnalytics/UserActivity.vue";
import ChallengesStats from "@/components/Analytics/AdminAnalytics/ChallengesStats.vue";
import AnalyticsBalance from "@/components/Analytics/AdminAnalytics/Balance.vue";
import AnalyticsProgressStatistics from "@/components/Analytics/AdminAnalytics/ProgressStatistics.vue";
import AnalyticsActivityIndex from "@/components/Analytics/AdminAnalytics/ActivityIndex.vue";

export default {
  name: "AnalyticsPageReports",
  components: {
    vSelect,
    Datepicker,
    ReportByMarketGoods,
    ReportByMarketPurchaseStats,
    ReportsByRating: defineAsyncComponent(() =>
      import("./Reports/reports-by-rating.vue")
    ),
    ReportsByDetailing: defineAsyncComponent(() =>
      import("./Reports/reports-by-detailing.vue")
    ),
    DownloadIcon: defineAsyncComponent(() =>
      import("@/components/Icons/download.vue")
    ),
    CloseIcon,
    FilterByOrganization,
    AnalyticsUserActivity,
    ChallengesStats,
    AnalyticsBalance,
    AnalyticsProgressStatistics,
    AnalyticsActivityIndex,
  },
  directives: {
    debounce: vue3Debounce({ lock: true }),
    scrollEnd: {
      mounted(el, binding) {
        const handler = () => {
          let tolerance = 0.1;
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
      fetchOlderTransactions: false,

      organizationSettings: organizationSettingsStore(),

      randomPeriod: false,
      selectedPeriod: null,
      periodList: [],
      dateRangeStart: null,
      dateRangeEnd: null,
      activityIndexByDepartments: false,

      activeNav: "rating",
      activeMarketNav: "goods",
      activeFilter: "all",
      searchByUsername: "",
      selectedOrganizationFilter: null,
      organizationsList: [],
      selectedDepartmentsList: [],
      ratingRows: [],
      detailingRows: [],
      challengesOnly: 0,
      detailingLimit: 50,
      detailingOffset: 1,
      detailingDesc: 1,
      detailingOrderBy: null,
      detailingReachedEnd: false,
      ratingLimit: 100,
      ratingOffset: 1,
      ratingDesc: 1,
      ratingOrderBy: null,
      ratingReachedEnd: null,
      thanksOnly: 0,

      isChallengesForDetailing: false,

      downloadPending: false,
    };
  },
  mounted() {
    this.getPeriods();
    if (this.profileInfo) {
      this.getOrganizations(this.profileInfo?.profile.organization_id);
      this.resetRatingPagination();
      this.getRating(this.profileInfo?.profile.organization_id);
    }
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    valueName() {
      return this.organizationSettings.settings.bonusname.RU.form6;
    },
    analyticsReportsNavigation() {
      return ANALYTICS_REPORTS_NAVIGATION(this, this.isAdmin);
    },
    analyticsMarketReportsNavigation() {
      return ANALYTICS_MARKET_REPORTS_NAVIGATION(this);
    },
    analyticsReportsFilters() {
      return ANALYTICS_REPORTS_FILTERS(this);
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
    isAdmin() {
      if (this.profileInfo?.privileged.length > 0) {
        if (
          this.profileInfo.privileged.some((el) => el.role == ROLE_TYPE.admin)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    showBonusChallengesFilters() {
      if (
        (this.activeNav == "rating" || this.activeNav == "detailing") &&
        !this.activityIndexByDepartments
      ) {
        return true;
      } else return false;
    },
  },
  watch: {
    fetchOlderTransactions: {
      handler() {
        if (this.activeNav === "detailing") {
          this.detailingScrolledToBottom();
        }
      },
    },
    randomPeriod() {
      if (this.randomPeriod) {
        this.selectedPeriod = null;
      } else {
        this.dateRangeStart = null;
        this.dateRangeEnd = null;
        this.resetRatingPagination();
        this.getRating(this.profileInfo.profile?.organization_id);

        this.resetDetailingPagination();
        this.getDetailing();
      }
    },
    selectedPeriod() {
      if (this.selectedPeriod) {
        if (this.randomPeriod) {
          this.randomPeriod = false;
          this.dateRangeStart = null;
          this.dateRangeEnd = null;
        } else {
          this.resetRatingPagination();
          this.getRating(this.profileInfo.profile?.organization_id);

          this.resetDetailingPagination();
          this.getDetailing();
        }
      } else {
        this.resetRatingPagination();
        this.getRating(this.profileInfo.profile?.organization_id);

        this.resetDetailingPagination();
        this.getDetailing();
      }
    },
    activeFilter() {
      if (this.activeFilter == "challenges") {
        this.isChallengesForDetailing = true;
      } else {
        this.isChallengesForDetailing = false;
      }
    },
    dateRangeStart() {
      if (this.dateRangeStart && this.dateRangeEnd) {
        this.resetRatingPagination();
        this.getRating(this.profileInfo.profile?.organization_id);

        this.resetDetailingPagination();
        this.getDetailing();
      } else if (!this.dateRangeStart && !this.dateRangeEnd) {
        this.randomPeriod = null;
        this.resetRatingPagination();
        this.getRating(this.profileInfo.profile?.organization_id);

        this.resetDetailingPagination();
        this.getDetailing();
      }
    },
    dateRangeEnd() {
      if (this.dateRangeStart && this.dateRangeEnd) {
        this.resetRatingPagination();
        this.getRating(this.profileInfo.profile?.organization_id);

        this.resetDetailingPagination();
        this.getDetailing();
      } else if (!this.dateRangeStart && !this.dateRangeEnd) {
        this.randomPeriod = null;
        this.resetRatingPagination();
        this.getRating(this.profileInfo.profile?.organization_id);

        this.resetDetailingPagination();
        this.getDetailing();
      }
    },
    selectedOrganizationFilter() {
      if (this.selectedOrganizationFilter === null) {
        this.changeOrganization();
      }
    },
    profileInfo() {
      this.getOrganizations(this.profileInfo?.profile.organization_id);
      this.resetRatingPagination();
      this.getRating(this.profileInfo?.profile.organization_id);
    },
  },
  methods: {
    handleScrollEnd() {
      if (this.activeNav === "detailing") {
        this.fetchOlderTransactions ^= true;
      }
      if (this.activeNav == "market" && this.activeMarketNav == "goods") {
        let marketGoodsComponent = this.$refs.goods;
        marketGoodsComponent.getOffers();
      }
      if (this.activeNav == "userActivity") {
        let userActivityComponent = this.$refs.userActivity;
        userActivityComponent.getUserActivity();
      }
      if (this.activeNav == "challenges") {
        let challengesStatsComponent = this.$refs.challenges;
        challengesStatsComponent.handleScrollEnd();
      }
      if (this.activeNav == "balance") {
        let balanceComponent = this.$refs.balance;
        balanceComponent.getBalance();
      }
      if (this.activeNav == "activityIndex") {
        let activityIndexComponent = this.$refs.activityIndex;
        activityIndexComponent.getActivityIndex();
      }
      if (this.activeNav == "progressStatistics") {
        let progressStatisticsComponent = this.$refs.progressStatistics;
        progressStatisticsComponent.getStatistics();
      }
    },
    resetRatingPagination() {
      this.ratingOffset = 1;
      this.ratingReachedEnd = false;
    },
    ratingScrolledToBottom() {
      if (!this.ratingReachedEnd) {
        this.ratingOffset++;
        this.getRating();
      }
    },
    initialGetDetailing() {
      this.resetDetailingPagination();
      this.getDetailing();
    },
    initialGetRating() {
      this.resetRatingPagination();
      this.getRating();
    },
    resetDetailingPagination() {
      this.detailingOffset = 1;
      this.detailingReachedEnd = false;
    },
    detailingScrolledToBottom() {
      if (!this.detailingReachedEnd) {
        this.detailingOffset++;
        this.getDetailing();
      }
    },
    onRatingSortChange(sortDetails) {
      if (sortDetails.length) {
        if (sortDetails[0].type === "none") {
          this.ratingOrderBy = null;
          this.ratingDesc = 1;
        } else if (sortDetails[0].type === "asc") {
          this.ratingOrderBy = sortDetails[0].field;
          this.ratingDesc = 0;
        } else {
          this.ratingOrderBy = sortDetails[0].field;
          this.ratingDesc = 1;
        }
      } else {
        this.ratingOrderBy = null;
      }

      this.resetRatingPagination();
      this.getRating();
    },
    onDetailingSortChange(sortDetails) {
      if (sortDetails.length) {
        if (sortDetails[0].type === "none") {
          this.detailingOrderBy = null;
        } else if (sortDetails[0].type === "asc") {
          this.detailingOrderBy = sortDetails[0].field;
        } else {
          this.detailingOrderBy = "-" + sortDetails[0].field;
        }
      } else {
        this.detailingOrderBy = null;
      }
      this.resetDetailingPagination();
      this.getDetailing();
    },
    getItemTitle(title) {
      if (title == "") {
        return this.valueName;
      } else {
        return title;
      }
    },
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    formatDate(date) {
      if (!date) return null;
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return (
        year +
        "-" +
        (month < 10 ? "0" : "") +
        month +
        "-" +
        (day < 10 ? "0" : "") +
        day
      );
    },
    changeNav(item) {
      this.activeNav = item.name;
    },
    changeMarketNavigation(item) {
      this.activeMarketNav = item.name;
    },
    changeFilter(item) {
      this.activeFilter = item.name;
      if (item.name === "thanks") {
        this.thanksOnly = 1;
        this.challengesOnly = 0;
        this.resetRatingPagination();
        this.getRating(this.profileInfo?.profile.organization_id);
        this.resetDetailingPagination();
        this.getDetailing();
      } else if (item.name === "challenges") {
        this.challengesOnly = 1;
        this.thanksOnly = 0;
        this.resetRatingPagination();
        this.getRating(this.profileInfo?.profile.organization_id);
        this.resetDetailingPagination();
        this.getDetailing();
      } else {
        this.challengesOnly = 0;
        this.thanksOnly = 0;
        this.resetRatingPagination();
        this.getRating(this.profileInfo?.profile.organization_id);
        this.resetDetailingPagination();
        this.getDetailing();
      }
    },
    changeOrganization() {
      this.resetRatingPagination();
      this.getRating(this.profileInfo?.profile.organization_id);
    },
    departmentChecked(list) {
      this.selectedDepartmentsList = list;
      this.changeOrganization();
    },
    async getPeriods() {
      try {
        let response = await axios.get(API_URIS.getPeriodsURL);
        this.periodList = response.data;
      } catch (err) {
        throw err;
      }
    },
    async getOrganizations(organizationId) {
      try {
        let response = await axios.post(API_URIS.getOrganizationDepartments, {
          organization_id: organizationId,
        });
        this.organizationsList = response.data;
      } catch (error) {
        throw error;
      }
    },
    async getRating(organizationId) {
      let isAdmin = false;
      for (let i = 0; i < this.profileInfo.privileged.length; ++i) {
        if (this.profileInfo.privileged[i].role_name == "Администратор") {
          isAdmin = true;
        }
      }
      try {
        if (isAdmin) {
          let payload = {
            organization_id: organizationId,
            // department_id: this.selectedOrganizationFilter?.id,
            by_challenges: this.challengesOnly,
            by_transactions: this.thanksOnly,
            date_from: this.formatDate(this.dateRangeStart),
            date_to: this.formatDate(this.dateRangeEnd),
            offset: this.ratingOffset,
            limit: this.ratingLimit,
            desc: this.ratingDesc,
          };
          if (
            this.activeNav === "rating" &&
            this.activeFilter === "challenges"
          ) {
            payload["department_id"] = this.selectedDepartmentsList.join(",");
          } else {
            payload["department_id"] = this.selectedOrganizationFilter?.id;
          }
          if (this.searchByUsername) {
            payload["search_name"] = this.searchByUsername;
          }
          if (this.ratingOrderBy) {
            payload["order_by"] = this.ratingOrderBy;
          }
          if (this.selectedPeriod) {
            payload["period_id"] = this.selectedPeriod.id;
          }

          const response = await axios.post(
            API_URIS.analyticsByRating,
            payload
          );
          if (this.ratingOffset > 1) {
            this.ratingRows.push(...response.data);
          } else {
            this.ratingRows = response.data;
          }
          if (response?.data?.length < this.ratingLimit) {
            this.ratingReachedEnd = true;
          }
        } else {
          let params = {};
          if (this.dateRangeStart && this.dateRangeEnd) {
            params = {
              date_from: this.formatDate(this.dateRangeStart),
              date_to: this.formatDate(this.dateRangeEnd),
            };
          }
          if (this.selectedPeriod) {
            params = {
              period_id: this.selectedPeriod.id,
            };
          }
          const response = await axios.get(API_URIS.analyticsByRating, {
            params,
          });
          this.ratingRows = response.data;
        }
      } catch (error) {
        throw error;
      }
    },
    async getDetailing() {
      if (this.isAdmin) {
        try {
          let params = {
            // format: "",
            only_transactions: this.thanksOnly,
            only_challenges: this.challengesOnly,
            search_user: this.searchByUsername,
            offset: this.detailingOffset,
            limit: this.detailingLimit,
          };
          if (this.searchByUsername) {
            params["search_user"] = this.searchByUsername;
          }
          if (this.detailingOrderBy) {
            params["order_by"] = this.detailingOrderBy;
          }
          if (this.selectedPeriod) {
            params["period_id"] = this.selectedPeriod.id;
          } else {
            params["date_from"] = this.formatDate(this.dateRangeStart);
            params["date_to"] = this.formatDate(this.dateRangeEnd);
          }
          let response = await axios.get(API_URIS.analyticsByDetailing, {
            params,
          });
          if (this.detailingOffset > 1) {
            this.detailingRows.push(...response.data);
          } else {
            this.detailingRows = response.data;
          }
          if (response?.data?.length < this.detailingLimit) {
            this.detailingReachedEnd = true;
          }
        } catch (error) {
          throw error;
        }
      }
    },
    async searchByUser() {
      try {
        this.resetRatingPagination();
        this.getRating();

        this.resetDetailingPagination();
        this.getDetailing();
      } catch (error) {
        throw error;
      }
    },
    async downloadRatingExcel(organizationId) {
      try {
        this.downloadPending = true;
        let payload = {
          format: "excel",
          organization_id: organizationId,
          // department_id: this.selectedOrganizationFilter?.id,
          challenges_only: this.challengesOnly,
          thanks_only: this.thanksOnly,
          date_from: this.formatDate(this.dateRangeStart),
          date_to: this.formatDate(this.dateRangeEnd),
          desc: this.ratingDesc,
          offset: 1,
          limit: 10000,
        };
        if (this.activeNav === "rating" && this.activeFilter === "challenges") {
          payload["department_id"] = this.selectedDepartmentsList.join(",");
        } else {
          payload["department_id"] = this.selectedOrganizationFilter?.id;
        }
        if (this.searchByUsername) {
          payload["search_name"] = this.searchByUsername;
        }
        if (this.ratingOrderBy) {
          payload["order_by"] = this.ratingOrderBy;
        }
        if (this.selectedPeriod) {
          payload["period_id"] = this.selectedPeriod.id;
        }
        let response = await axios.post(
          API_URIS.downloadAnalyticsByRating,
          payload,
          {
            responseType: "arraybuffer",
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }
        );
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        let xlsxUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = xlsxUrl;
        if (this.dateRangeStart && this.dateRangeEnd) {
          link.download = `Индекс внутренней активности (${
            this.organizationSettings.settings.name
          })  ${this.formatDate(this.dateRangeStart)} ${this.formatDate(
            this.dateRangeEnd
          )}.xlsx`;
        } else {
          link.download = `Индекс внутренней активности (${
            this.organizationSettings.settings.name
          }) ${new Date().toLocaleDateString("ru-RU")}.xlsx`;
        }
        link.click();
        this.downloadPending = false;
      } catch (err) {
        this.downloadPending = false;
        throw err;
      }
    },
    async downloadDetailingExcel() {
      let params = {
        resp_format: "excel",
        // only_transactions: this.thanksOnly,
        // only_challenges: this.challengesOnly,
        // date_from: this.formatDate(this.dateRangeStart),
        // date_to: this.formatDate(this.dateRangeEnd),
      };
      if (this.searchByUsername) {
        params["search_user"] = this.searchByUsername;
      }
      if (this.detailingOrderBy) {
        params["order_by"] = this.detailingOrderBy;
      }
      if (this.selectedPeriod) {
        params["period_id"] = this.selectedPeriod.id;
      } else {
        params["date_from"] = this.formatDate(this.dateRangeStart);
        params["date_to"] = this.formatDate(this.dateRangeEnd);
      }
      try {
        this.downloadPending = true;
        let response = await axios.get(API_URIS.analyticsByDetailing, {
          params,
          responseType: "arraybuffer",
        });
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        let xlsxUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = xlsxUrl;
        if (this.dateRangeStart && this.dateRangeEnd) {
          link.download = `Детализация (${
            this.organizationSettings.settings.name
          })  ${this.formatDate(this.dateRangeStart)} по ${this.formatDate(
            this.dateRangeEnd
          )}.xlsx`;
        } else {
          link.download = `Детализация (${
            this.organizationSettings.settings.name
          }) ${new Date().toLocaleDateString("ru-RU")}.xlsx`;
        }
        link.click();
        this.downloadPending = false;
      } catch (err) {
        this.downloadPending = false;
        throw err;
      }
    },
    async downloadExcel() {
      if (this.activeNav === "detailing") {
        this.downloadDetailingExcel();
      } else if (this.activeNav === "rating") {
        this.downloadRatingExcel(this.profileInfo?.profile.organization_id);
      }
    },
  },
};
</script>

<style scoped>
::v-deep(.dp__input) {
  z-index: 12;
  padding: 14px 16px !important;
  border-radius: 12px !important;
  height: 52px !important;
}
::v-deep(.v-select) {
  height: 52px !important;
}
::v-deep(.vs__dropdown-toggle) {
  height: 52px !important;
}
.input-slot-image {
  width: 20px;
  margin: 4px 6px 0 0;
}
.analytics_page_reports {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  padding: 52px;
  background: var(--generalColorWhite);
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  border-radius: 24px 0 0 0;
  overflow-y: auto;
  margin: 0;
}
.analytics_page_reports::-webkit-scrollbar {
  width: 8px;
}
.analytics_page_reports::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.analytics_page_reports_filter_header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.analytics_page_reports_navigation {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  width: 64%;
}
.reports_navigation_item_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 36px;
  color: var(--generalColorSecondary) !important;
  transition: 0.4s;
  white-space: nowrap !important;
}

.reports_navigation_item_text:hover {
  color: #5f5f5f;
  cursor: pointer;
}
.reports_navigation_item_text.active {
  color: var(--generalContrast) !important;
}
.reports_navigation_item_text_small {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 36px;
  color: var(--generalColorSecondary) !important;
  transition: 0.4s;
}
.reports_navigation_item_text_small:hover {
  color: #5f5f5f;
  cursor: pointer;
}
.reports_navigation_item_text_small.active {
  color: var(--generalContrast) !important;
}
.analytics_page_reports_filters {
  display: flex;
  gap: 12px;
  align-items: center;
}
.reports_filters_item_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 32px;
  color: var(--generalColorSecondary);
  transition: 0.4s;
  text-transform: capitalize;
}
.reports_filters_item_text:hover {
  color: #5f5f5f;
  cursor: pointer;
}
.reports_filters_item_text.active {
  color: var(--generalBrand);
}
.analytics_page_reports_navigation_market {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.analytics_page_reports_search_header {
  width: 100%;
  display: flex;
  flex-direction: row !important;
  align-items: flex-start;
  gap: 12px;
  justify-content: space-between;
  flex-wrap: wrap;
}
.search_by_user {
  display: flex;
  gap: 12px;
}
.search_by_user_input {
  background-color: var(--generalColorWhite);
  width: 326px;
  height: 52px;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 1px solid var(--neutral5);
  border-radius: 12px;
  outline: none;
  color: var(--generalColorSecondary);
  font-size: 14px;
}
.search_by_user_organization {
  width: 270px;
}
.search_by_date {
  /* width: 800px; */
  display: flex;
  gap: 12px;
}

.period_selection_options {
  display: flex;
  gap: 15px;
  align-items: center;
}
.activity_index_switcher {
  display: flex;
  gap: 8px;
  align-items: center;
}
.activity_index_switcher_title {
  font-family: "Golos";
  font-size: 18px;
  font-weight: 400;
  color: var(--generalContrast);
  margin: 0;
}
._switch {
  margin: 6px 0 0 0;
}
.download_button {
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
.download_button:hover {
  opacity: 0.9;
  transform: translate(0px, -1px);
}
.period_selector {
  width: 260px !important;
  height: 52px !important;
}
.style-chooser {
  height: 52px !important;
}
.random_period_selector {
  display: flex;
  gap: 15px;
}
.random_period {
  display: flex;
  align-items: center;
  gap: 8px;
}
.range_period {
  display: flex;
  align-items: center;
  gap: 8px;
}
.range_input {
  width: 135px;
}
.checkbox {
  -webkit-appearance: none;
  appearance: none;
  min-width: 20px;
  width: 20px;
  height: 20px;
  background-color: #ecf0f3;
  border-radius: 6px;
  border: 1px solid var(--generalBrandLight);
  position: relative;
  cursor: pointer;
  outline: none;
  transition: 0.3s;
}
.checkbox:checked {
  background-color: var(--generalBrand);
  background-image: url("@/assets/checkMark.png");
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.1s;
}
.analytics_page_reports_grid {
  width: 100% !important;
}
@media (min-width: 1281px) {
  .analytics_page_reports_search_header {
    flex-direction: column;
    align-items: flex-start;
  }
}
@media (max-width: 1600px) {
  .search_by_date {
    width: 800px;
    display: flex;
    gap: 12px;
  }
  .download_button {
    width: 160px !important;
    gap: 6px;
  }
  .period_selector {
    width: 230px;
  }
  .random_period {
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
  }
}
@media (max-width: 1280px) {
  .search_by_date {
    flex-direction: column-reverse;
  }
  .random_period_selector {
    flex-wrap: wrap;
  }
  .analytics_page_reports {
    gap: 20px;
    padding: 24px;
  }
  .analytics_page_reports_filter_header {
    flex-wrap: wrap;
    gap: 12px;
  }
  .analytics_page_reports_navigation {
    flex-wrap: wrap;
    gap: 12px;
  }
  .reports_navigation_item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .reports_navigation_item_text {
    font-size: 16px;
    line-height: 28px;
    text-align: left !important;
    color: var(--generalContrast);
  }
  .analytics_page_reports_search_header {
    gap: 12px;
  }
}
@media (max-width: 768px) {
  .period_selection_options {
    flex-wrap: wrap;
  }
  .period_selector {
    flex-wrap: wrap;
    width: 100%;
    max-width: 300px;
  }
  .analytics_page_reports {
    margin: 0 0 120px 0;
  }
  .search_by_user {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    width: 100%;
  }
  .search_by_user_input {
    width: 100%;
    height: 30px;
  }
  .search_by_user_organization {
    width: 100%;
  }
  .analytics_page_reports_search_header {
    flex-wrap: wrap;
    gap: 12px;
  }
  .search_by_date {
    width: 100% !important;
    flex-direction: column-reverse;
  }
  .dp__main.dp__theme_light.challenge_date_picker {
    max-width: 768px !important;
    min-width: 100% !important;
  }
  .period_selector {
    width: 100%;
  }
  .download_button {
    width: 100% !important;
  }
}
.download_icon {
  width: 14px;
  height: 18px;
}
</style>
