<template>
  <div class="main_page_charts_wrapper">
    <div class="main_page_charts_header">
      <h3 class="main_page_charts_title">
        {{ $t("mainPage.companyValues") }}
      </h3>
      <h5 class="main_page_period_name general-secondary-color">
        {{ $t("mainPage.forPeriod") + " " + valuesForChart?.period_name }}
      </h5>
    </div>
    <div class="main_page_charts_items" v-show="isHavestatistic">
      <MainPageRoundChart :values="valuesForChart" />
      <MainPageLineChart :values="valuesForChart" />
    </div>
    <h3 v-if="!isHavestatistic" class="main_page_chart_items_no_stats">
      {{ $t("mainPage.noStats") }}
    </h3>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import MainPageRoundChart from "@/components/MainPageElements/MainCharts/main-round-chart.vue";
import MainPageLineChart from "@/components/MainPageElements/MainCharts/main-line-chart.vue";
export default {
  name: "MainPageCharts",
  components: {
    MainPageRoundChart,
    MainPageLineChart,
  },
  data() {
    return {
      valuesForChart: null,
      isHavestatistic: false,
    };
  },
  watch: {
    valuesForChart() {
      if (this.valuesForChart.transactions_total !== 0) {
        this.isHavestatistic = true;
      }
    },
  },
  methods: {
    async getCharts() {
      try {
        let response = await axios.get(API_URIS.organizationCharts);
        this.valuesForChart = response.data;
      } catch (error) {
        throw error;
      }
    },
  },
  mounted() {
    this.getCharts();
  },
};
</script>

<style scoped>
.main_page_charts_wrapper {
  background-color: var(--generalColorWhite);
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  padding: 52px 52px 52px 52px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: auto;
}
.main_page_charts_header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  width: auto;
}
.main_page_charts_title {
  margin: 0;
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  color: var(--generalContrast);
  margin: 0;
}
.main_page_period_name {
  margin: 0;
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.main_page_charts_items {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}
.main_page_chart_items_no_stats {
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  color: var(--generalContrast);
  text-align: center;
  width: 100%;
}
@media (max-width: 1500px) {
  .main_page_charts_items {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
}
@media (max-width: 1360px) {
  .main_page_charts_wrapper {
    padding: 24px;
    width: auto;
    max-height: auto;
    height: 1000px;
  }
  .main_page_charts_items {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
}
@media (max-width: 768px) {
  .main_page_charts_wrapper {
    align-items: center;
    padding: 24px;
  }
  .main_page_charts_items {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
}
</style>