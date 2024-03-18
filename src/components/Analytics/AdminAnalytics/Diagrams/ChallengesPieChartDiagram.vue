<template>
  <div class="result_line_graph">
    {{ chartData.chartLabel }}
    <div class="result_line_graph_wrapper">
      <ApexCharts
        v-if="series?.length"
        height="500px"
        width="100%"
        :series="series"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script>
import ApexCharts from "vue3-apexcharts";

export default {
  name: "ChallengesPieChartDiagram",
  props: {
    chartData: {
      required: true,
      default: {
        seriesData: [],
        chartOptionsCategories: [],
        labelsRotation: null,
        yAxisTitle: "",
        chartLabel: "",
      },
    },
  },
  components: {
    ApexCharts,
  },
  mounted() {
    this.setChartData();
  },
  data() {
    return {
      offersList: null,
      series: [],
      categories: [],
      hasCategories: false,
      hasSeries: false,
    };
  },
  computed: {
    colors() {
      return [
        "#fe8667",
        "#84bc8f",
        "#dd75b4",
        "#53a9b1",
        "#ff8d94",
        "#435b96",
        "#76acdd",
        "#86c376",
        "#77c6d7",
        "#9252b9",
        "#ff8246",
        "#f06761",
        "#7bc366",
        "#faae9a",
        "#cef73a",
        "#0192f3",
        "#854102",
        "#FF8D6F",
        "#68A7AD",
        "#6567c9",
        "#f3df6d",
        "#0a2cee",
        "#f715ff",
        "#92BA92",
        "#56d456",
        "#fa5fff",
        "#fc9fff",
        "#f3cba6",
      ];
    },
    chartOptions() {
      return {
        colors: this.colors,
        chart: {
          width: "80px",
          type: "pie",
          toolbar: {
            show: true,
          },
        },
        labels: this.categories,
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "left",
          height: "100%",
          width: "100%",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
                horizontalAlign: "left",
              },
            },
          },
        ],
      };
    },
  },
  methods: {
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
      this.series = this.chartData.series;
      this.categories = this.chartData.chartOptionsCategories;
      this.setTitleForDownloadButtons();
    },
  }
};
</script>

<style scoped>

.result_line_graph {
  width: 100%;
  max-width: 700px;
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