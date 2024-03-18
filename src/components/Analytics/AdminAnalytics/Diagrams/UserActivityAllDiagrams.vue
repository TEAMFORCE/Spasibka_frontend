<template>
  <div class="user_activity_all_diagrams">
    <BarChartChallenges
      v-if="usersActivityAllData.length"
      :chart-data="activityIndexData"
    />
    <BarChartChallenges
      v-if="usersActivityAllData.length"
      :chart-data="receivedThanksData"
    />
    <BarChartChallenges
      v-if="usersActivityAllData.length"
      :chart-data="sentThanksData"
    />
    <BarChartChallenges
      v-if="usersActivityAllData.length"
      :chart-data="receivedTransfersCountData"
    />
    <BarChartChallenges
      v-if="usersActivityAllData.length"
      :chart-data="sentTransfersCountData"
    />
    <BarChartChallenges
      v-if="usersActivityAllData.length"
      :chart-data="sentThanksToChallengesData"
    />
    <BarChartChallenges
      v-if="usersActivityAllData.length"
      :chart-data="createdChallengesCountData"
    />
    <BarChartChallenges
      v-if="usersActivityAllData.length"
      :chart-data="receivedThanksFromChallengesData"
    />
    <BarChartChallenges
      v-if="usersActivityAllData.length"
      :chart-data="participatedInChallengesData"
    />
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";
import BarChartChallenges from "./BarChartChallenges.vue";

export default {
  name: "UserActivityAllDiagrams",
  props: {
    isLoading: {
      required: true
    }
  },
  components: { BarChartChallenges },
  data() {
    return {
      usersActivityAllData: [],
    };
  },
  mounted() {
    this.getUserActivity();
  },
  computed: {
    activityIndexData() {
      return this.activityData(
        "rating",
        this.$t(
          "analyticsPage.adminAnalytics.challengesStats.diagrams.activityIndex"
        )
      );
    },
    receivedThanksData() {
      return this.activityData(
        "receivedThanks",
        this.$t(
          "analyticsPage.adminAnalytics.challengesStats.diagrams.thanksReceived"
        )
      );
    },
    sentThanksData() {
      return this.activityData(
        "sentThanks",
        this.$t(
          "analyticsPage.adminAnalytics.challengesStats.diagrams.thanksSent"
        )
      );
    },
    receivedTransfersCountData() {
      return this.activityData(
        "receivedTransactions",
        this.$t(
          "analyticsPage.adminAnalytics.challengesStats.diagrams.transfersReceived"
        )
      );
    },
    sentTransfersCountData() {
      return this.activityData(
        "sentTransactions",
        this.$t(
          "analyticsPage.adminAnalytics.challengesStats.diagrams.transfersSent"
        )
      );
    },
    sentThanksToChallengesData() {
      return this.activityData(
        "sentToChallenges",
        this.$t(
          "analyticsPage.adminAnalytics.challengesStats.diagrams.sentThanksToChallenges"
        )
      );
    },
    createdChallengesCountData() {
      return this.activityData(
        "countChallenges",
        this.$t(
          "analyticsPage.adminAnalytics.challengesStats.diagrams.challengesCreated"
        )
      );
    },
    receivedThanksFromChallengesData() {
      return this.activityData(
        "receivedFromChallenges",
        this.$t(
          "analyticsPage.adminAnalytics.challengesStats.diagrams.receivedThanksFromChallenges"
        )
      );
    },
    participatedInChallengesData() {
      return this.activityData(
        "participatedInChallenges",
        this.$t(
          "analyticsPage.adminAnalytics.challengesStats.diagrams.participatedInChallenges"
        )
      );
    },
  },
  methods: {
    activityData(fieldName, seriesName) {
      let list = structuredClone(this.usersActivityAllData);
      if (!list.length) {
        return {
          seriesName: "Series",
          seriesData: [],
          chartOptionsCategories: [],
        };
      }
      list.sort((a, b) => {
        return a[fieldName] - b[fieldName];
      });

      let maxValue = list[list.length - 1][fieldName];
      let minValue = list[0][fieldName];
      let diff = maxValue - minValue;
      const intervalsCount = Math.min(10, maxValue);
      let intervalLength = Math.floor(diff / intervalsCount);

      let series = [];
      for (let i = 0; i < intervalsCount; ++i) {
        series.push(0);
      }

      let categories = [];
      for (let i = 0; i < list.length; ++i) {
        series[
          Math.max(
            1,
            Math.min(
              intervalsCount,
              Math.ceil(
                list[i][fieldName] / Math.floor(maxValue / intervalsCount)
              )
            )
          ) - 1
        ]++;
      }
      for (let i = 0; i < intervalsCount; ++i) {
        if (i === intervalsCount - 1) {
          categories.push(`(${intervalLength * i}, ${maxValue}]`);
        } else {
          if (i === 0) {
            categories.push(
              `[${intervalLength * i}, ${intervalLength * (i + 1)}]`
            );
          } else {
            categories.push(
              `(${intervalLength * i}, ${intervalLength * (i + 1)}]`
            );
          }
        }
      }
      return {
        seriesName: seriesName,
        seriesData: series,
        chartOptionsCategories: categories,
        labelsRotation: 0,
        yAxisTitle: this.$t(
          "analyticsPage.adminAnalytics.challengesStats.diagrams.usersCount"
        ),
      };
    },
    async getUserActivity() {
      try {
        this.$emit("isLoading");
        let params = {
          offset: 1,
          limit: 10000,
        };
        const response = await axios.post(API_URIS.analyticsByRating, params);
        this.usersActivityAllData = response.data;
        this.$emit("finishedLoading");
      } catch (err) {
        this.$emit("finishedLoading");
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.user_activity_all_diagrams {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
