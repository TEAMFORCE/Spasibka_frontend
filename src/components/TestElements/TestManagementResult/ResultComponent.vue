<template>
  <div class="test_management_result">
    <div class="download_excell_wrapper" v-if="userRole == 'Администратор'">
      <button
        v-if="downloadPending"
        class="download_excell brand-secondary-bg general-brand-color"
        disabled
      >
        {{ $t("analyticsPage.reports.processing") }}
      </button>
      <button
        v-else
        class="download_excell general-brand-bg"
        @click="downloadExcel"
      >
        <DownloadIcon :currentColor="getIconColor()" />
        {{ $t("analyticsPage.reports.inputs.uplToExcel") }}
      </button>
    </div>
    <div class="result_chart">
      <h3 class="result_chart_title">
        {{ $t("tests.result.title") }}
      </h3>

      <div class="result_chart_wrapper">
        <ApexCharts
          type="line"
          width="1000"
          height="395"
          :options="chartOptions"
          :series="series"
          v-if="dataLoaded"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { mapStores } from "pinia";
import { useStore as useProfileStore } from "@/store/profile";

import DownloadIcon from "@/components/Icons/download.vue";
import ApexCharts from "vue3-apexcharts";

export default {
  name: "TestManagementResult",
  components: {
    DownloadIcon,
    ApexCharts,
  },
  data() {
    return {
      downloadPending: false,
      series: [
        {
          data: [10, 30, 20, 50, 40, 30, 49, 10, 20, 10, 50, 50], // users
        },
      ],
      dataLoaded: false,
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    userRole() {
      let role = "";
      for (let i = 0; i < this.profileInfo?.privileged.length; ++i) {
        let curRole = this.profileInfo.privileged[i];
        role = curRole.role_name;
        if (role == "Администратор") {
          break;
        }
      }
      if (role == "") {
        role = "Пользователь";
      }
      return role;
    },
    chartOptions() {
      return {
        chart: {
          type: "line",
          toolbar: { show: false },
        },
        colors: ["#2f7230"],
        dataLabels: {
          enabled: false,
        },
        markers: {
          strokeWidth: 0,
          size: 6,
          hover: {
            size: 8,
          },
        },
        xaxis: {
          categories: this.getCategories(),
          tooltip: {
            enabled: false,
          },
          labels: {
            show: true,
          },
        },
        tooltip: {
          enabled: true,
          x: {
            show: true,
            formatter: (seriesName) => `${seriesName} ${this.getUsersTitle()}`,
          },
          y: {
            formatter: function (
              value,
              { series, seriesIndex, dataPointIndex, w }
            ) {
              return `${value}`;
            },
            title: {
              formatter: (seriesName) => `${this.$t("tests.result.pointMany")}`,
            },
          },
          z: {
            show: false,
            // formatter: undefined,
            // title: "Size: ",
          },
          marker: {
            show: false,
          },
        },
      };
    },
  },
  methods: {
    getIconColor() {
      let generalColorWhite = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalColorWhite");
      return generalColorWhite;
    },
    getUsersTitle(value) {
      return this.$t("tests.result.peopleOne");
    },
    getCategories() {
      let currentCategories = [];
      for (let i = 0; i < 20; i++) {
        currentCategories.push(`${i}`);
      }
    },
    async downloadExcel() {
      try {
        this.downloadPending = true;

        setTimeout(() => {
          this.downloadPending = false;
        }, 1000);
      } catch (err) {
        this.downloadPending = false;
        throw err;
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.dataLoaded = true;
    }, 1000);
  },
};
</script>

<style >
.test_management_result {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
}
.result_chart {
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  border: 1px solid var(--generalColorGrey);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.result_chart_title {
  font-family: "Golos";
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  color: var(--generalContrast);
  margin: 0;
}
.download_excell {
  width: 192px !important;
  height: 52px !important;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: var(--generalColorWhite);
  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  transition: 0.3s;
}
.download_icon {
  width: 14px;
  height: 18px;
}
.download_excell:hover {
  opacity: 0.9;
  transform: translate(0px, -1px);
}
</style>