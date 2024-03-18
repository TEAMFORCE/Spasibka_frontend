<template>
  <div class="result_line_graph">
    <div class="result_line_graph_wrapper">
      {{ chartData.seriesName }}
      <ApexCharts type="bar" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>

<script>
import ApexCharts from "vue3-apexcharts";

export default {
  name: "BarChartChallenges",
  components: {
    ApexCharts,
  },
  props: {
    chartData: {
      required: true,
      default: {
        seriesName: "",
        seriesData: [],
        chartOptionsCategories: [],
        labelsRotation: null,
        yAxisTitle: "",
      },
    },
  },

  data() {
    return {
      series: [
        {
          name: this.chartData.seriesName,
          data: this.chartData.seriesData,
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "bar",
        },
        plotOptions: {
          bar: {
            // borderRadius: 10,
            // columnWidth: "50%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          // width: 2,
        },

        grid: {
          row: {
            colors: ["#fff", "#f2f2f2"],
          },
        },
        xaxis: {
          labels: {
            rotate: -45,
            formatter: function(val) {
              // Truncate labels longer than a specific length
              if (val.length > 15) return `${val.substring(0, 15)}...`;
              return val;
            }
          },
          categories: this.chartData.chartOptionsCategories,
          
          // tickPlacement: "on",
        },
        tooltip: {
          x: {
            formatter: function(val, { series, seriesIndex, dataPointIndex, w }) {
              // Return full label from categories for tooltips
              return w.config.xaxis.categories[dataPointIndex];
            }
          }
        },
        yaxis: {
          title: {
            text: "",
          },
        },
        // fill: {
        //   type: "gradient",
        //   gradient: {
        //     shade: "light",
        //     type: "horizontal",
        //     shadeIntensity: 0.25,
        //     gradientToColors: undefined,
        //     inverseColors: true,
        //     opacityFrom: 0.85,
        //     opacityTo: 0.85,
        //     stops: [50, 0, 100],
        //   },
        // },
      },
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
      this.series[0].name = this.chartData.seriesName;
      this.series[0].data = this.chartData.seriesData;
      this.chartOptions.xaxis.categories =
        this.chartData.chartOptionsCategories;
      if (!this.labelsRotation) this.chartOptions.xaxis.labels.rotate = -45;
      else this.chartOptions.xaxis.labels.rotate = labelsRotation;

      if (this.chartData.yAxisTitle) {
        this.chartOptions.yaxis.title.text = this.chartData.yAxisTitle;
      }
      this.setTitleForDownloadButtons();
    },
  },
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
