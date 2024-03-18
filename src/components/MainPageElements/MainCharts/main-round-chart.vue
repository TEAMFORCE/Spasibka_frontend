<template>
  <div class="main_round_chart_wrapper">
    <ApexCharts
      type="donut"
      :options="chartOptions"
      :series="series"
      width="340"
    />
    <div class="total_transacrion_count_wrapper">
      <div class="total_transacrion_count">
        <span>{{ totalTransaction }}</span>
      </div>
      <div class="total_tooltip">
        {{
          `${$t("mainPage.totalCountTransactions")} ${totalTransaction} ${$t(
            "mainPage.count"
          )}`
        }}
      </div>
    </div>

    <div class="round_chart_tags">
      <span class="chart_tag" v-for="tag in chartOptions.labels" ref="chartTag">
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script>
import ApexCharts from "vue3-apexcharts";

export default {
  name: "MainPageRoundChart",
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
      chartData: [],
      totalTransaction: "",
    };
  },
  computed: {
    series() {
      let newSeries = [];
      for (let i = 0; i < this.chartData.length; i++) {
        newSeries.push(+this.chartData[i].percentage.toFixed(0));
      }
      return newSeries;
    },
    chartOptions() {
      return {
        labels: this.chartData.map((el) => el.name),
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
          type: "donut",
          dropShadow: {
            enabled: false,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 3,
            color: "#000",
            opacity: 0.35,
          },
        },
        legend: {
          show: false,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
          },
        },
        dataLabels: {
          enabled: true,
          dropShadow: {
            enabled: false,
          },
          style: {
            fontFamily: "Roboto",
            fontSize: "14px",
            fontWeight: "700",
          },
          formatter: function (val) {
            return val.toFixed(0);
          },
        },
        responsive: [],
      };
    },
  },
  watch: {
    values() {
      let result = [];
      for (const key in this.values.tags_percentage) {
        result.push({
          name: key,
          percentage: this.values.tags_percentage[key].percentage,
        });
      }
      this.totalTransaction = this.values.transactions_total;
      this.chartData = result;
      setTimeout(() => {
        let tags = this.$refs["chartTag"];
        for (let i = 0; i < tags.length; i++) {
          tags[i].style.backgroundColor = this.chartOptions.colors[i];
        }
      }, 10);
    },
  },
};
</script>

<style scoped>
.main_round_chart_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  /* width: 44%; */
  position: relative;
}
.total_transacrion_count_wrapper {
  width: 340px;
  height: 100%;
  position: absolute;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.total_transacrion_count {
  cursor: pointer;
  font-size: 38px;
  font-family: "Golos";
  font-weight: 500;
}
.total_tooltip {
  opacity: 0;
  position: absolute;
  top: 90px;
  /* left: 100px; */
  transition: 0.3s;
  width: 150px;
  background-color: var(--generalBrand);
  border-radius: 8px;
  font-size: 12px;
  font-family: "Roboto";
  color: var(--generalColorWhite);
}
.total_transacrion_count:hover ~ .total_tooltip {
  opacity: 1;
}
@media (max-width: 768px) {
  .total_transacrion_count_wrapper {
    width: 340px;
    height: 264px;
    left: 50%;
    top: 0;
    transform: translate(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .total_transacrion_count {
    font-size: 38px;
  }
  .total_tooltip {
    top: 80px;
    left: 30%;
  }
}
/* @media (max-width: 512px) {
  .total_transacrion_count_wrapper {
    width: 340px;
    height: 60%;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .total_transacrion_count {
    font-size: 38px;
  }
  .total_tooltip {
    top: 80px;
    left: 40%;
  }
} */
.round_chart_tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 320px;
  max-height: 230px;
  justify-content: flex-start;
  align-items: flex-start;
}
.chart_tag {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
  margin: 0;
  border-radius: 12px;
  font-family: "Roboto";
  font-weight: 400;
  font-size: 12px;
  line-height: 0px;
  color: var(--generalColorWhite);
}
@media (max-width: 1600px) {
  .round_chart_tags {
    max-width: 340px;
  }
}
@media (max-width: 768px) {
  .main_round_chart_wrapper {
    flex-direction: column;
    /* width: 100%; */
  }
  .vue-apexcharts {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100% !important;
  }
  .apexchartsrtcgjun8 {
    width: 100% !important;
  }
  .round_chart_tags {
    max-width: 100%;
  }
}
</style>