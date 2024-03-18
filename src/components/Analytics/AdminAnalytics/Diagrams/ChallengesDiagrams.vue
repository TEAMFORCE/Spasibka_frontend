<template>
  <div class="challenges_diagrams" ref="scrollContainer">
    <Loading
      class="spinner_loader"
      :active="getStatsLock"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <HorizontalBarChartChallenges
      v-if="challengesData.length && !isChallengesDataLoading"
      :chartData="dataForHorizontalBarChart"
      @selectSortingParameter="selectSortingParameter"
    />
    <ChallengesPieChartDiagram
      v-if="allChallengesData.length"
      :chartData="challengesDataByWinnerMethod"
    />
    <ChallengesPieChartDiagram
      v-if="allChallengesData.length"
      :chartData="sponsorsDataByChallengesCount"
    />
    <ChallengesPieChartDiagram
    v-if="allChallengesData.length"
      :chartData="sponsorsDataByPrizeFund"
    />
   <BarChartChallenges
      v-if="challengesByExecutionStatus.length"
      :chartData="dataForExecutionStatusDiagram"
    />
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";
import BarChartChallenges from "./BarChartChallenges.vue";
import HorizontalBarChartChallenges from "./HorizontalBarChartChallenges.vue";
import Loading from "vue3-loading-overlay";
import ChallengesPieChartDiagram from "./ChallengesPieChartDiagram.vue";
import { organizationSettingsStore } from "@/store/organization-settings";

export default {
  name: "ChallengesDiagrams",
  components: { BarChartChallenges, Loading, HorizontalBarChartChallenges, ChallengesPieChartDiagram },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),

      allChallengesData: [],
      isAllChallengesDataLoading: false,

      isChallengesDataLoading: false,
      challengesData: [],
      challengesByExecutionStatus: [],
      sortingParameters: [
        {
          name: this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.participantsCount"),
          sort_by: "participants_count",
        },
        {
          name: this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.prizePlaces"),
          sort_by: "number_of_prizes",
        },
        {
          name: this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.winnersCount"),
          sort_by: "winners_count",
        },
      ],
      currentSortingParameter: null,
      getStatsLock: true,
    };
  },
  async mounted() {
    this.currentSortingParameter = this.sortingParameters[0];
    this.positionLoader();
    await Promise.all([
      this.getChallengesData(),
      this.getAllChallengesData(),
      this.getChallengesByExecutionStatus()
    ]);
    this.getStatsLock = false;
  },
  computed: {
    challengesDataByWinnerMethod() {
      let cntVotingsDetermine = 0;
      let cntOrganizatorDetermine = 0;
      for (let i = 0; i < this.allChallengesData.length; ++i) {
        if (this.allChallengesData[i].winner_method === "выбирает организатор"){
          cntOrganizatorDetermine++;
        } else {
          cntVotingsDetermine++;
        }
      }
      return {
        series: [cntOrganizatorDetermine, cntVotingsDetermine],
        chartOptionsCategories: 
          [
            this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.organizator"),
            this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.voting"),
          ],
        chartLabel: this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.winnerIsDeterminedBy")
      }
    },
    sponsorsDataByChallengesCount() {
      let cntUserVotings = 0;
      let cntOrganizationVotings = 0;
      for (let i = 0; i < this.allChallengesData.length; ++i) {
        if (this.allChallengesData[i].account === "пользователь"){
          cntUserVotings++;
        } else {
          cntOrganizationVotings++;
        }
      }
      return {
        series: [cntUserVotings, cntOrganizationVotings],
        chartOptionsCategories: 
          [
            this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.participants"),
            this.organizationSettings.settings.name
          ],
        chartLabel: this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.sponsorByChallengesCount")
      }
    },
    sponsorsDataByPrizeFund() {
      let cntUserFund = 0;
      let cntOrganizationFund = 0;
      for (let i = 0; i < this.allChallengesData.length; ++i) {
        if (this.allChallengesData[i].account === "пользователь"){
          cntUserFund += this.allChallengesData[i].start_balance;
        } else {
          cntOrganizationFund += this.allChallengesData[i].start_balance;
        }
      }
      return {
        series: [cntUserFund, cntOrganizationFund],
        chartOptionsCategories: 
          [
            this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.participants"),
            this.organizationSettings.settings.name
          ],
        chartLabel: this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.sponsorByPrizeFund")
      }
    },
    dataForHorizontalBarChart() {
      return this.dataForHorizontalDiagram();
    },
    dataForExecutionStatusDiagram() {
      return this.dataForDiagram(this.challengesByExecutionStatus,
      this.$t(
        "analyticsPage.adminAnalytics.challengesStats.diagrams.executionStatus"
      ),
      "exec_status");
    },
  },
  methods: {
    positionLoader() {
      const el = document.getElementsByClassName("admin_analytics_page")[0];
      const rect = el.getBoundingClientRect();

      const loaderEl = this.$refs.spinnerLoader.$el;
      loaderEl.style.position = "fixed";
      loaderEl.style.display = "flex";
      loaderEl.style.top = `${rect.top}px`;
      loaderEl.style.left = `${rect.left}px`;
      loaderEl.style.width = `${rect.width}px`;
      loaderEl.style.height = `${rect.height}px`;
    },
    async getAllChallengesData() {
      try {
        let params = {
          limit: 10000,
          offset: 1,
        }
        const response = await axios.get(API_URIS.adminAnalyticsChallenges, {
          params
        });
        this.allChallengesData = response.data.details;
      } catch(err) {

      }
    },
    selectSortingParameter(param) {
      this.currentSortingParameter = param;
      this.getChallengesData();
    },
    dataForDiagram(challengesList, listSeriesName, fieldName) {
      let seriesData = [];
      let chartOptionsCategories = [];
      let seriesName = listSeriesName;
      for (let i = 0; i < challengesList.length; ++i) {
        seriesData.push(challengesList[i][fieldName]);
        chartOptionsCategories.push(challengesList[i].name);
      }
      return {
        seriesName: seriesName,
        seriesData: seriesData,
        chartOptionsCategories: chartOptionsCategories
      };
    },
    dataForHorizontalDiagram() {
      let seriesForDiagram = [];
      for (let i = 0; i < this.sortingParameters.length; ++i) {
        let curParam = this.sortingParameters[i];
        seriesForDiagram.push(this.dataForDiagram(this.challengesData, curParam.name, curParam.sort_by));
      }
      return {
        series: seriesForDiagram,
        chartOptionsCategories: seriesForDiagram[0].chartOptionsCategories,
        sortingParameters: this.sortingParameters,
        selectedSortingParameter: this.currentSortingParameter,
        chartLabel: this.$t("analyticsPage.adminAnalytics.challengesStats.diagrams.challengesStatistics")
      }
    },
    async getChallengesData() {
      try {
        this.isChallengesDataLoading = true;
        let params = {
          limit: 20,
          offset: 1,
          sort_by: this.currentSortingParameter.sort_by,
          desc: true
        };
        const response = await axios.get(API_URIS.adminAnalyticsChallenges, {
          params,
        });
        this.challengesData = response.data.details;
        this.isChallengesDataLoading = false;
      } catch (err) {
        this.isChallengesDataLoading = false;
        throw err;
      }
    },
    async getChallengesByExecutionStatus() {
      try {
        let params = {
          limit: 20,
          offset: 1,
          sort_by: "exec_status",
          desc: true
        };
        const response = await axios.get(API_URIS.adminAnalyticsChallenges, {
          params,
        });
        this.challengesByExecutionStatus = response.data.details;
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.challenges_diagrams {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
::v-deep(.vue-apexcharts > .apexcharts-canvas > svg) {
  overflow: visible;
  text-overflow: ellipsis;
}
.spinner_loader {
  z-index: 10000 !important;
}
</style>
