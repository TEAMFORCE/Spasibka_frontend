<template>
  <div class="main_line_chart_wrapper">
    <ApexCharts
      type="line"
      :options="chartOptions"
      :series="series"
      width="100%"
      height="100%"
    />
  </div>
</template>

<script>
import ApexCharts from "vue3-apexcharts";

export default {
  name: "MainPageLineChart",
  components: {
    ApexCharts,
  },
  props: {
    values: {
      default: [],
    },
  },
  data() {
    return {
      series: [],
      chartData: [],
      datesData: [],
    };
  },
  computed: {
    chartOptions() {
      return {
        colors: [
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
        ],
        chart: {
          type: "line",
          toolbar: {
            show: false,
          },
        },
        legend: {
          show: false,
        },
        tooltip: {
          enabled: true,
        },
        stroke: {
          curve: "smooth",
          lineCap: "round",
          width: 1,
        },
        xaxis: {
          // categories: Object.keys(this.chartData),
          categories: this.datesData,
        },
        // yaxis: {
        //   min: 0,
        //   max: 100,
        //   tickAmount: 4,
        // },
      };
    },
  },
  watch: {
    values() {
      if (this.values.transactions_total > 0) {
        this.chartData = this.values.week_stats;
        let newSeries = [];

        let weekStast = Object.entries(this.values.week_stats);
        let tags = weekStast[0][1];
        for (let i = 0; i < tags.length; i++) {
          newSeries.push({
            name: tags[i].tag_name,
            data: [],
          });
        }
        this.series = newSeries;
      }
    },
    series() {
      let weekStatsToArray = Object.entries(this.values.week_stats);

      for (let i = 0; i < weekStatsToArray.length; i++) {
        weekStatsToArray[i][0] = new Date(
          weekStatsToArray[i][0]
        ).toLocaleDateString();
      }
      setTimeout(() => {
        for (let i = 0; i < this.series.length; i++) {
          for (let j = 0; j < weekStatsToArray.length; j++) {
            this.series[i].data.push(
              weekStatsToArray[j][1].find(
                (el) => el.tag_name == this.series[i].name
              ).amount
            );
          }
        }
      }, 1000);
    },
    chartData() {
      this.datesData = Object.keys(this.chartData);
      for (let i = 0; i < this.datesData.length; i++) {
        this.datesData[i] = new Date(this.datesData[i]).toLocaleDateString();
      }
    },
  },
};
</script>

<style scoped>
.main_line_chart_wrapper {
  min-width: 55%;
  height: 320px;
  flex-grow: 1;
}
@media (max-width: 1800px) {
  .main_line_chart_wrapper {
    min-width: 50%;
  }
}
@media (max-width: 1600px) {
  .main_line_chart_wrapper {
    min-width: 46%;
  }
}
@media (max-width: 1500px) {
  .main_line_chart_wrapper {
    min-width: 100%;
  }
}
</style>