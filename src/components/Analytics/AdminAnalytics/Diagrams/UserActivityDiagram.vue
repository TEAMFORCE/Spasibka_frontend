<template>
  <div class="analytics_use_activity_diagram">
    <div class="content_loading" v-if="!this.hasCategories && !this.hasSeries">
      <span class="loader"></span>
    </div>
    <Transition name="slide-fade">
      <div class="_diagram_wrapper" v-if="this.hasCategories && this.hasSeries">
        <h2 class="analytics_use_activity_diagram_title">
          {{ $t("analyticsPage.adminAnalytics.diagrams.userActivityTitle") }}
        </h2>
        <ApexCharts
          v-if="this.hasCategories && this.hasSeries"
          type="bar"
          :options="chartOptions"
          :series="series"
          width="700"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import ApexCharts from "vue3-apexcharts";
import DownloadIcon from "@/components/Icons/download.vue";

export default {
  name: "AnalyticsUserActivityDiagram",
  components: {
    ApexCharts,
    DownloadIcon,
  },
  data() {
    return {
      usersActivityInfo: null,
      series: [
        {
          data: [],
        },
      ],
      categories: null,
      hasCategories: false,
      hasSeries: false,
    };
  },
  computed: {
    colors() {
      return ["#4f81bd"];
    },
    chartOptions() {
      return {
        chart: {
          type: "bar",
          height: 350,
          toolbar: {
            show: true,
          },
        },

        colors: this.colors,
        plotOptions: {
          bar: {
            columnWidth: "99%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        legend: {
          show: true,
          width: "700",
          markers: {
            width: 0,
            height: 0,
          },
        },
        xaxis: {
          categories: this.categories,
          labels: {
            show: false,
          },
        },
        tooltip: {
          enabled: false,
        },
      };
    },
  },
  methods: {
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");
      return generalColorWhite;
    },
    async getUsersActivity() {
      try {
        let params = {
          offset: 1,
          limit: 99999999999,
          sort_by: "date",
        };
        let response = await axios.get(API_URIS.adminAnalyticsUserActivity, {
          params,
        });
        this.usersActivityInfo = response.data.details;
        this.setCategories();
        this.setSeries();
        this.setTitleForDownloadButtons();
      } catch (err) {
        throw err;
      }
    },
    divideArray(arr) {
      let halfLength = Math.ceil(arr.length / 2);
      let firstHalf = arr.slice(0, halfLength);
      let secondHalf = arr.slice(halfLength);
      return [firstHalf, secondHalf];
    },
    setCategories() {
      const formattedDates = this.usersActivityInfo
        .map((el) => el.last_activity.last_event_datetime)
        .filter((el) => el)
        .map((date) => new Date(date).toLocaleDateString("ru-RU"));
      const uniqueDates = [...new Set(formattedDates)];

      const [intermediateDatesFirst, intermediateDatesSecond] =
        this.divideArray(uniqueDates.slice(1, -1));
      const arrayToReturn = [
        uniqueDates[0],
        ...(intermediateDatesFirst.length > 1
          ? [
              `${intermediateDatesFirst[0]} - ${
                intermediateDatesFirst[intermediateDatesFirst.length - 1]
              }`,
            ]
          : intermediateDatesFirst),
        ...(intermediateDatesSecond.length > 1
          ? [
              `${intermediateDatesSecond[0]} - ${
                intermediateDatesSecond[intermediateDatesSecond.length - 1]
              }`,
            ]
          : intermediateDatesSecond),
        uniqueDates[uniqueDates.length - 1],
      ];
      this.categories = arrayToReturn;
      this.hasCategories = true;
    },
    formatSeries(allSeries, uniqueSeries) {
      let firstElIndex = allSeries.indexOf(uniqueSeries[0]);
      let lastElIndex = allSeries.lastIndexOf(
        uniqueSeries[uniqueSeries.length - 1]
      );
      let countOfElements = allSeries.slice(
        firstElIndex,
        lastElIndex + 1
      ).length;
      return countOfElements;
    },
    formatSeriesByIndex(allSeries, element) {
      let firstElIndex = allSeries.indexOf(element);
      let lastElIndex = allSeries.lastIndexOf(element);
      let countOfElements = allSeries.slice(
        firstElIndex,
        lastElIndex + 1
      ).length;
      return countOfElements;
    },
    setSeries() {
      let formattedDates = this.usersActivityInfo
        .map((el) => el.last_activity.last_event_datetime)
        .filter((el) => el)
        .map((date) => new Date(date).toLocaleDateString("ru-RU"));
      const uniqueDates = [...new Set(formattedDates)];
      const [intermediateDatesFirst, intermediateDatesSecond] =
        this.divideArray(uniqueDates.slice(1, -1));
      let firstColumnValue = this.formatSeriesByIndex(
        formattedDates,
        formattedDates[0]
      );
      let secondColumnValue = this.formatSeries(
        formattedDates,
        intermediateDatesFirst
      );
      let thirdColumnValue = this.formatSeries(
        formattedDates,
        intermediateDatesSecond
      );
      let fourColumnValue = this.formatSeriesByIndex(
        formattedDates,
        formattedDates[formattedDates.length - 1]
      );
      this.series[0].data = [
        firstColumnValue,
        secondColumnValue,
        thirdColumnValue,
        fourColumnValue,
      ];
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
    this.getUsersActivity();
  },
};
</script>

<style scoped>
.testImage {
  width: 100px;
  height: 100px;
}
._download_icon {
  width: 10px !important;
  height: 10px !important;
}
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
.analytics_use_activity_diagram {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
._diagram_wrapper {
  min-width: 700px;
  max-width: 700px;
  width: 100%;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
  padding: 16px;
}
.analytics_use_activity_diagram_title {
  font-family: "Golos";
  font-size: 22px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;
  color: var(--generalContrast);
  margin: 16px 0 0 0;
}
::v-deep(.apexcharts-legend) {
  justify-content: space-evenly !important;
  padding: 0;
  width: 100% !important;
}
</style>