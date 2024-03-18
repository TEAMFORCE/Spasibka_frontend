<template>
  <div class="analytics_benefits_diagram">
    <div class="content_loading" v-if="!this.hasCategories && !this.hasSeries">
      <span class="loader"></span>
    </div>
    <Transition name="slide-fade">
      <div class="_diagram_wrapper" v-if="this.hasCategories && this.hasSeries">
        <h2 class="analytics_benefits_diagram_title">
          {{ $t("analyticsPage.adminAnalytics.diagrams.benefitsTitle") }}
        </h2>
        <ApexCharts
          v-if="this.hasCategories && this.hasSeries"
          height="500px"
          width="100%"
          :series="series"
          :options="chartOptions"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import ApexCharts from "vue3-apexcharts";

export default {
  name: "AnalyticsBenefitsDiagram",
  components: {
    ApexCharts,
  },
  data() {
    return {
      offersList: null,
      series: [],
      categories: null,
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
          position: "right",
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
    async getOffers() {
      try {
        let params = {
          offset: 1,
          limit: 99999999999,
        };

        let response = await axios.get(API_URIS.adminAnalyticsBenefitCafe, {
          params,
        });
        this.offersList = response.data.details;
        this.setFormattedList();
        this.setTitleForDownloadButtons();
      } catch (err) {
        throw err;
      }
    },
    formatName(name) {
      if (name.length > 10) {
        let formattedName = name.slice(0, 10);
        formattedName = formattedName + "...";
        return formattedName;
      } else {
        return name;
      }
    },
    setFormattedList() {
      let formattedList = this.offersList.map((el) => ({
        name: el.name,
        purchasesValue:
          el.considered + el.declined + el.purchased + el.send_or_delivered,
      }));
      let sortedFormattedList = formattedList.sort((a, b) => {
        if (a.purchasesValue < b.purchasesValue) {
          return 1;
        } else {
          return -1;
        }
      });
      let totalPurchasesValue = sortedFormattedList.reduce(
        (acc, obj) => acc + obj.purchasesValue,
        0
      );
      let twoPercentOfTotalPurchases = (totalPurchasesValue * 0.02).toFixed(0);
      let lessThanTwo = sortedFormattedList.filter(
        (el) => el.purchasesValue < twoPercentOfTotalPurchases
      );
      let lessThanTwoPurchasesValue = lessThanTwo.reduce(
        (acc, obj) => acc + obj.purchasesValue,
        0
      );
      let otherBenefits = {
        name: this.$t("analyticsPage.adminAnalytics.diagrams.other"),
        purchasesValue: lessThanTwoPurchasesValue,
      };
      let moreThanTwo = sortedFormattedList.filter(
        (el) => el.purchasesValue >= twoPercentOfTotalPurchases
      );
      moreThanTwo.push(otherBenefits);
      this.categories = moreThanTwo.map((el) => el.name);
      this.hasCategories = true;
      this.series = moreThanTwo.map((el) => el.purchasesValue);
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
      }, 200);
    },
  },
  mounted() {
    this.getOffers();
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
.analytics_benefits_diagram {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
._diagram_wrapper {
  min-width: 400px;
  width: 60%;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
  padding: 16px;
}
.analytics_benefits_diagram_title {
  font-family: "Golos";
  font-size: 22px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;
  color: var(--generalContrast);
  margin: 16px 0;
}
::v-deep(.apexcharts-legend) {
  /* justify-content: space-evenly !important; */
  flex-wrap: wrap;
}
::v-deep(.apexcharts-legend::-webkit-scrollbar) {
  height: 4px;
  width: 4px;
  background: var(--minorInfoSecondaryColor);
  border-radius: 50px;
}
::v-deep(.apexcharts-legend::-webkit-scrollbar-thumb) {
  border-radius: 30px;
  background-color: var(--generalColorSecondary);
  width: 8px;
  cursor: pointer !important;
}

::v-deep(.apexcharts-legend-series) {
  text-align: left;
}
</style>