<template>
  <div class="result_line_graph">
    {{ chartData.chartLabel }}
    <div class="input_field_wrapper">
      <div
        class="input_field_placeholder general-secondary-color general-white-bg"
      >
        {{ $t("analyticsPage.adminAnalytics.challengesStats.diagrams.sortBy") }}
      </div>
      <vSelect
        :clearable="false"
        class="sorting_parameters_selector"
        v-model="selectedSortingParameter"
        :options="sortingParameters"
        @option:selected="selectSortingParameter"
        label="name"
        :placeholder="$t('analyticsPage.adminAnalytics.challengesStats.diagrams.sortBy')"
      />
    </div>
    <div class="result_line_graph_wrapper">
      <ApexCharts type="bar" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";
import ApexCharts from "vue3-apexcharts";

export default {
  name: "HorizontalBarChartChallenges",
  components: {
    ApexCharts,
    vSelect
  },
  props: {
    chartData: {
      required: true,
      default: {
        seriesData: [],
        chartOptionsCategories: [],
        labelsRotation: null,
        yAxisTitle: "",
        chartLabel: "",
        sortingParameters: [],
        selectedSortingParameter: null,
      },
    },
  },
  data() {
    return {
      selectedSortingParameter: null,
      series: [{
        name: 'Кол-во победителей',
        // Populate with your data for 20 challenges
        data: []
      }, {
        name: 'Кол-во участников',
        // Populate with your data for 20 challenges
        data: []
      }, {
        name: 'Кол-во призовых мест',
        // Populate with your data for 20 challenges
        data: []
      }],
      chartOptions: {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '100%',
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '8px',
            colors: ['#fff']
          }
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              cssClass: 'apexcharts-yaxis-label',
            },
          },
          axisBorder: {
            show: true,
          },
          axisTicks: {
            show: true
          }
        },
      }
    };
  },
  mounted() {
    // this.setChartData();
  },
  watch: {
    chartData: {
      handler() {
        this.setChartData();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    selectSortingParameter(parameter) {
      this.selectedSortingParameter = parameter;
      this.$emit("selectSortingParameter", parameter);
    },
    setTitleForDownloadButtons() {
      setTimeout(() => {
        let downloadSvg = document.getElementsByClassName(
          "apexcharts-menu-item"
        );
        for (let i = 0; i < downloadSvg.length; ++i) {
          if (i % 3 == 0) {
            downloadSvg[i].textContent = `${this.$t(
              "analyticsPage.adminAnalytics.diagrams.download"
            )} SVG`;
          }
          if (i % 3 === 1) {
            downloadSvg[i].textContent = `${this.$t(
              "analyticsPage.adminAnalytics.diagrams.download"
            )} PNG`;
          }
          if (i % 3 === 2) {
            downloadSvg[i].textContent = `${this.$t(
              "analyticsPage.adminAnalytics.diagrams.download"
            )} CSV`;
          }
        }
      }, 100);
    },
    setChartData() {
      if (!this.chartData) return;
      this.selectedSortingParameter = this.chartData.selectedSortingParameter;
      this.series = this.chartData.series;
      for (let i = 0; i < this.series.length; ++i) {
        this.series[i].name = this.series[i].seriesName;
        this.series[i].data = this.series[i].seriesData;
      }
      this.sortingParameters = this.chartData.sortingParameters;
      this.chartOptions.xaxis.categories =
        this.chartData.chartOptionsCategories;
      
      this.setTitleForDownloadButtons();
    },
  },
};
</script>

<style scoped>
.result_line_graph {
  width: 100%;
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  box-sizing: border-box;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;

  gap: 35px;
  font-family: "Golos";
  font-size: 18px;
  font-weight: 500;
  line-height: 36px;
}
.input_field_wrapper {
  position: relative;
  width: 100%;
}
.input_field_placeholder {
  z-index: 3;
  position: absolute;
  padding: 0px 5px;
  top: -9px;
  left: 15px;
  font-family: "SF Pro Text";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.sorting_parameters_selector {
  max-width: 500px;
}
::v-deep(.apexcharts-legend) {
  justify-content: space-evenly !important;
  padding: 0;
}
::v-deep(.vue-apexcharts) {
  width: 100%;
}
.result_line_graph_wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
  font-family: "Golos";
  font-size: 18px;
  font-weight: 500;
  line-height: 36px;
}
</style>
