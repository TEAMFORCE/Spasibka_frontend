<template>
  <div class="progress_statistics_diagram">
    <div class="content_loading" v-if="!isLoaded">
      <span class="loader"></span>
    </div>
    <Transition name="slide-fade">
      <div class="_diagram_wrapper" v-if="isLoaded">
        <div class="_diagram_header">
          <h2 class="progress_statistics_diagram_title">
            {{
              $t(
                "analyticsPage.adminAnalytics.diagrams.progressStatisticsTitle"
              )
            }}
          </h2>
          <div class="_type_selector_wrapper">
            <vSelect
              class="style-chooser"
              v-model="selectedType"
              :options="questionnaireTypes"
              :clearable="false"
              :placeholder="this.$t('types.questionaireTypes.title')"
              label="title"
              @option:selected="typeSelected"
            />
          </div>
        </div>
        <ApexCharts
          v-if="this.hasCategories && this.hasSeries"
          type="bar"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { QUESTIONNAIRE_TYPES } from "@/infrastructure/data-sources/questionnaire-types";

import vSelect from "vue-select";
import ApexCharts from "vue3-apexcharts";

export default {
  name: "ProgressStatisticsDiagram",
  components: {
    vSelect,
    ApexCharts,
  },
  data() {
    return {
      isLoaded: false,
      selectedType: null,
      statisticsData: null,
      series: [],
      categories: null,
      hasCategories: false,
      hasSeries: false,
    };
  },
  computed: {
    questionnaireTypes() {
      return QUESTIONNAIRE_TYPES(this);
    },
    colors() {
      return ["#4f81bd", "#c0504d"];
    },
    chartOptions() {
      return {
        colors: this.colors,
        chart: {
          type: "bar",
          stacked: true,
          stackType: "100%",
          width: "100%",
          toolbar: {
            show: true,
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "60%",
            horizontal: true,
          },
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },

        tooltip: {
          y: {
            formatter: (val) =>
              `${val} ${this.$t(
                "analyticsPage.adminAnalytics.diagrams.users"
              )}`,
          },
        },
        fill: {
          opacity: 1,
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40,
        },
        xaxis: {
          categories: this.categories,
          labels: {
            show: true,
            style: {
              colors: [],
              fontSize: "12px",
              fontFamily: "Golos",
              fontWeight: 400,
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
      };
    },
  },
  methods: {
    setDefaultType() {
      this.selectedType = this.questionnaireTypes[0];
    },

    typeSelected() {
      this.hasCategories = false;
      this.hasSeries = false;
      this.getStatistics();
    },
    async getStatistics() {
      try {
        let params = {
          offset: 1,
          limit: 99999999999,
        };
        if (this.selectedType) {
          params.type = this.selectedType.type;
        }
        let response = await axios.get(API_URIS.adminAnalyticsQuestionnaires, {
          params,
        });
        this.statisticsData = response.data.details;
        this.setFormattedList();
        this.setTitleForDownloadButtons();
      } catch (err) {
        throw err;
      }
    },
    countOfRemaining(el) {
      let remained = el.participant_amount - el.complited_amount;
      return remained;
    },
    setFormattedList() {
      this.categories = this.statisticsData.map((el) => el.name);
      this.series = [
        {
          name: this.$t("analyticsPage.adminAnalytics.diagrams.userPassed"),
          data: this.statisticsData.map((el) => el.complited_amount),
        },
        {
          name: this.$t("analyticsPage.adminAnalytics.diagrams.userDidntPass"),
          data: this.statisticsData.map((el) => this.countOfRemaining(el)),
        },
      ];
      this.hasCategories = true;
      this.hasSeries = true;
    },
    setTitleForDownloadButtons() {
      setTimeout(() => {
        let downloadSvg = document.getElementsByClassName(
          "apexcharts-menu-item"
        );
        downloadSvg[0].textContent = `${this.$t(
          "analyticsPage.adminAnalytics.diagrams.download"
        )} SVG`;
        downloadSvg[1].textContent = `${this.$t(
          "analyticsPage.adminAnalytics.diagrams.download"
        )} PNG`;
        downloadSvg[2].textContent = `${this.$t(
          "analyticsPage.adminAnalytics.diagrams.download"
        )} CSV`;
      }, 100);
    },
  },
  mounted() {
    this.setDefaultType();
    this.getStatistics();
    this.isLoaded = true;
  },
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.content_loading {
  margin: 10% 0 0 0;
}
.progress_statistics_diagram {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
._diagram_wrapper {
  width: 40%;
  min-width: 700px;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
  padding: 16px;
}
._diagram_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 32px 0;
}
.progress_statistics_diagram_title {
  font-family: "Golos";
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  color: var(--generalContrast);
  margin: 0;
}
._type_selector_wrapper {
  width: 300px;
}
::v-deep(.apexcharts-legend) {
  justify-content: space-evenly !important;
  padding: 0;
  /* width: 100% !important; */
}
</style>