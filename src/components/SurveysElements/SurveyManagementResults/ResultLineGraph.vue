<template>
  <div class="result_line_graph">
    <h3 class="result_line_graph_title">
      {{ question.question }}
    </h3>
    <h4 class="result_line_graph_description">
      {{ question.description }}
    </h4>
    <h5 class="result_line_graph_all_votes">
      {{ getAnswer() }}
    </h5>
    <div class="result_line_graph_wrapper">
      <ApexCharts
        type="bar"
        :options="chartOptions"
        :series="series"
        width="586"
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
import { ANSWER_TYPE } from "@/infrastructure/constants/survey-answer-type";

export default {
  name: "ResultLineGraph",
  components: {
    ApexCharts,
  },
  props: {
    question: {
      required: true,
    },
    type: {
      default: null,
    },
  },

  data() {
    return {
      series: [
        {
          data: [],
        },
      ],
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
        chart: {
          type: "bar",
          height: 350,
          toolbar: { show: false },
        },

        colors: this.colors,
        plotOptions: {
          bar: {
            columnWidth: "80%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val, opts) => `${val} (${this.getPercentage(val)})`,
        },
        legend: {
          show: true,
          width: "586",
          markers: {
            radius: 100,
            width: 7,
            height: 7,
          },
        },
        xaxis: {
          categories: this.getCategories(),
          labels: {
            show: false,
          },
        },
        tooltip: {
          enabled: false,
        },
      };
    },
    allVotes() {
      return this.series[0].data.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
    },
    answerType() {
      return ANSWER_TYPE;
    },
  },
  methods: {
    getPercentage(val) {
      let percentage = (val / this.allVotes) * 100;
      return `${Math.round(percentage)}%`;
    },
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
      if (this.type === this.answerType.SCALE) {
        let valueArrays = [];
        for (let key in this.question.inner_object[0].answers) {
          valueArrays.push(this.question.inner_object[0].answers[key]);
        }
        this.series[0].data = valueArrays;
      } else {
        for (let i = 0; i < this.question.inner_object.length; i++) {
          this.series[0].data.push(this.question.inner_object[i].answers);
        }
      }
    },
    setAnswers() {
      if (this.type === this.answerType.SCALE) {
        this.answerOptions = Object.keys(this.question.inner_object[0].answers);
      } else {
        for (let i = 0; i < this.question.inner_object.length; i++) {
          this.answerOptions.push(this.question.inner_object[i].answer);
        }
      }
    },
    getCategories() {
      let categories = [];
      if (this.type === this.answerType.SCALE) {
        let valueArrays = [];
        for (let key in this.question.inner_object[0].answers) {
          valueArrays.push(this.question.inner_object[0].answers[key]);
        }
        for (let i = 0; i < valueArrays.length; i++) {
          categories.push([`${this.$t("surveys.answer")} ${i + 1}`]);
        }
      } else {
        for (let i = 0; i < this.question.inner_object.length; i++) {
          categories.push([`${this.$t("surveys.answer")} ${i + 1}`]);
        }
      }
      return categories;
    },
  },
  mounted() {
    this.setSeries();
    this.setAnswers();
  },
};
</script>

<style  scoped>
.result_line_graph {
  width: 100%;
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
.result_line_graph_title {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
.result_line_graph_description {
  font-family: "Golos";
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  margin: 0;
  color: var(--generalContrast);
}
.result_line_graph_all_votes {
  font-family: "Golos";
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  text-align: left;
  margin: 0;
  color: var(--generalColorSecondary);
}
.result_line_graph_wrapper {
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