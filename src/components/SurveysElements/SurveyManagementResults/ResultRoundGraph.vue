<template>
  <div class="result_round_graph">
    <h3 class="result_round_graph_title">
      {{ question.question }}
    </h3>
    <h4 class="result_round_graph_description">
      {{ question.description }}
    </h4>
    <h5 class="result_round_graph_all_votes">
      {{ getAnswer() }}
    </h5>
    <div class="result_round_graph_wrapper">
      <ApexCharts
        type="donut"
        :options="chartOptions"
        :series="series"
        width="360"
      />
      <div class="graph_description">
        <div class="answer_option" v-for="(answer, index) in answerOptions">
          <div
            class="_circle"
            :style="{ backgroundColor: colors[index] }"
          ></div>
          <span class="answer_option_text">
            {{ answer }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApexCharts from "vue3-apexcharts";

export default {
  name: "ResultRoundGraph",
  components: {
    ApexCharts,
  },
  props: {
    question: {
      required: true,
    },
  },
  data() {
    return {
      series: [],
      answerOptions: [],
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
          type: "donut",
        },
        legend: {
          show: false,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "55%",
            },
          },
        },
        tooltip: {
          enabled: false,
        },
        stroke: {
          show: false,
        },
        dataLabels: {
          enabled: true,
          dropShadow: {
            enabled: false,
          },
          style: {
            fontFamily: "Golos",
            fontSize: "14px",
            fontWeight: "500",
          },
          formatter: function (val) {
            return `${val.toFixed(0)}%`;
          },
        },
      };
    },
    allVotes() {
      return this.series.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
    },
  },
  methods: {
    getAnswer() {
      if (this.allVotes % 10 === 1 && this.allVotes % 100 !== 11) {
        return `${this.allVotes} ${this.$t("surveys.results.answer")}`;
      } else if (
        this.allVotes % 10 >= 2 &&
        this.allVotes % 10 <= 4 &&
        (this.allVotes % 100 < 10 || this.allVotes % 100 >= 20)
      ) {
        return `${this.allVotes} ${this.$t("surveys.results.answerTwo")}`;
      } else {
        return `${this.allVotes} ${this.$t("surveys.results.answerFive")}`;
      }
    },
    setSeries() {
      for (let i = 0; i < this.question.inner_object.length; i++) {
        this.series.push(this.question.inner_object[i].answers);
      }
    },
    setAnswers() {
      for (let i = 0; i < this.question.inner_object.length; i++) {
        this.answerOptions.push(this.question.inner_object[i].answer);
      }
    },
  },
  mounted() {
    this.setSeries();
    this.setAnswers();
  },
};
</script>

<style scoped>
.result_round_graph {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  box-sizing: border-box;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
}
.result_round_graph_title {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
.result_round_graph_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
.result_round_graph_all_votes {
  font-family: "Golos";
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  text-align: left;
  margin: 0;
  color: var(--generalColorSecondary);
}
.result_round_graph_wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 35px;
}
.graph_description {
  height: 100%;
  max-height: 363px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 24px;
}
.answer_option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: default;
}
.answer_option_text {
  font-family: "Golos";
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: var(--generalContrast);
  text-align: left;
}
._circle {
  width: 7px;
  height: 7px;
  border-radius: 100%;
}
</style>