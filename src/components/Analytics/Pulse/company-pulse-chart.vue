<template>
  <div class="company_pulse_chart" v-if="chartData.length > 0">
    <ApexCharts
      type="donut"
      :options="chartOptions"
      :series="series"
      width="340"
    />
    <div class="total_transaction_count_wrapper">
      <div class="total_transacrion_count">
        <span>{{ totalTransaction }}</span>
      </div>
      <div class="total_tooltip">
        {{
          `${$t(
            "mainPage.totalCountTransactionsReceived"
          )} ${totalTransaction} ${$t("mainPage.count")}`
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
  name: "CompanyPulseChart",
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
      windowWidth: window.innerWidth,
      chartData: [],
      totalTransaction: "",
    };
  },
  created() {
    window.addEventListener("resize", this.updateWidth);
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
      this.totalTransaction = this.values.sender_transactions_count;
      this.chartData = result;
      setTimeout(() => {
        let tags = this.$refs["chartTag"];
        for (let i = 0; i < tags?.length; i++) {
          tags[i].style.backgroundColor = this.chartOptions.colors[i];
        }
      }, 10);
    },
  },
  methods: {
    updateWidth() {
      this.windowWidth = window.innerWidth;
    },
  },
};
</script>

<style scoped>
.company_pulse_chart {
  display: flex;
  align-items: center;
  position: relative;
}

.total_transaction_count_wrapper {
  width: 340px;
  height: 100%;
  position: absolute;
  top: -4px;
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
.total_transaction_count span {
  font-weight: 500;
  font-size: 38px;
  font-family: "Golos" !important;
}

.total_tooltip {
  opacity: 0;
  position: absolute;
  top: 70px;
  left: 50px;
  transition: 0.3s;
  width: 140px;
  background-color: var(--generalBrand);
  border-radius: 8px;
  padding: 2px 4px;
  font-size: 12px;
  font-family: "Roboto";
  color: var(--generalColorWhite);
}

.total_transacrion_count:hover ~ .total_tooltip {
  opacity: 1;
}

.round_chart_tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 630px;
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

@media (max-width: 768px) {
  .total_transaction_count_wrapper {
    width: 340px;
    height: 264px;
    left: 50%;
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
  .company_pulse_chart {
    flex-direction: column;
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