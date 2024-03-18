<template>
  <div class="analytics_page_my_pulse">
    <div class="analytics_page_my_pulse_header">
      <div class="period_selector">
        <vSelect
          class="style-chooser"
          v-model="selectedPeriod"
          :options="periodList"
          :placeholder="$t('analyticsPage.myPulse.choosePeriod')"
          label="name"
        />
      </div>
      <div class="random_period_selection">
        <div class="random_period">
          <input type="checkbox" class="checkbox" v-model="randomPeriod" />
          <label>
            <span class="category_option_text">
              {{ $t("analyticsPage.myPulse.randomPeriod") }}
            </span>
          </label>
        </div>
        <Transition>
          <div class="range_period" v-if="randomPeriod">
            <div class="range_input">
              <Datepicker
                v-model="dateRangeStart"
                class="challenge_date_picker"
                text-input
                auto-apply
                format="dd.MM.yyyy"
                locale="ru"
                position="left"
                :clearable="true"
                :placeholder="$t('analyticsPage.myPulse.dateStart')"
                :enable-time-picker="false"
              >
                <template #clear-icon="{ clear }">
                  <CloseIcon @click="clear" />
                </template>
              </Datepicker>
            </div>
            <div class="range_input">
              <Datepicker
                v-model="dateRangeEnd"
                class="challenge_date_picker"
                text-input
                auto-apply
                format="dd.MM.yyyy"
                locale="ru"
                position="left"
                :clearable="true"
                :placeholder="$t('analyticsPage.myPulse.dateEnd')"
                :enable-time-picker="false"
              >
                <template #clear-icon="{ clear }">
                  <CloseIcon @click="clear" />
                </template>
              </Datepicker>
            </div>
            <div class="range_end"></div>
          </div>
        </Transition>
      </div>
    </div>
    <div class="analytics_page_my_pulse_chart">
      <MyPulseChart :values="myPulse" />
      <MyPulseStats :statsData="myPulse" />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

import axios from "axios";
import { API_URIS } from "@/constants/api";

import vSelect from "vue-select";
import Datepicker from "@vuepic/vue-datepicker";
import CloseIcon from "@/components/Icons/close.vue";

export default {
  name: "AnalyticsPageMyPulse",
  components: {
    vSelect,
    Datepicker,
    MyPulseChart: defineAsyncComponent(() =>
      import("./Pulse/my-pulse-chart.vue")
    ),
    MyPulseStats: defineAsyncComponent(() =>
      import("./Pulse/my-pulse-stats.vue")
    ),
    CloseIcon,
  },
  data() {
    return {
      randomPeriod: false,
      selectedPeriod: null,
      periodList: [],
      dateRangeStart: null,
      dateRangeEnd: null,
      myPulse: [],
    };
  },
  computed: {},
  watch: {
    randomPeriod() {
      if (this.randomPeriod) {
        this.selectedPeriod = null;
      } else {
        this.dateRangeStart = null;
        this.dateRangeEnd = null;
        this.getPulse();
      }
    },
    selectedPeriod() {
      if (this.selectedPeriod) {
        this.randomPeriod = false;
        this.dateRangeStart = null;
        this.dateRangeEnd = null;
        this.getPulse();
      } else {
        this.getPulse();
      }
    },
    dateRangeStart() {
      if (this.dateRangeStart && this.dateRangeEnd) {
        this.getPulse();
      } else if (!this.dateRangeStart && !this.dateRangeEnd) {
        this.randomPeriod = null;
        this.getPulse();
      }
    },
    dateRangeEnd() {
      if (this.dateRangeStart && this.dateRangeEnd) {
        this.getPulse();
      } else if (!this.dateRangeStart && !this.dateRangeEnd) {
        this.randomPeriod = null;
        this.getPulse();
      }
    },
  },
  methods: {
    formatDate(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return (
        year +
        "-" +
        (month < 10 ? "0" : "") +
        month +
        "-" +
        (day < 10 ? "0" : "") +
        day
      );
    },
    async getPeriods() {
      try {
        let response = await axios.get(API_URIS.getPeriodsURL);
        this.periodList = response.data;
        if (this.periodList.length) {
          this.selectedPeriod = this.periodList[0];
        }
      } catch (err) {
        throw err;
      }
    },
    async getPulse() {
      try {
        let params = {
          date_from: this.dateRangeStart
            ? this.formatDate(this.dateRangeStart)
            : null,
          date_to: this.dateRangeEnd
            ? this.formatDate(this.dateRangeEnd)
            : null,
        };
        if (this.selectedPeriod && !this.dateRangeStart && !this.dateRangeEnd) {
          params.period_id = this.selectedPeriod.id;
        }
        let response = await axios.get(API_URIS.myPulse, { params });
        this.myPulse = response.data;
      } catch (err) {
        throw err;
      }
    },
  },
  mounted() {
    this.getPeriods();
  },
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.analytics_page_my_pulse {
  overflow: hidden;
  height: 100%;
}
.analytics_page_my_pulse_header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.period_selector {
  width: 300px;
}
.vs__dropdown-toggle {
  border: none;
}
.vs__dropdown-menu {
  /* box-shadow: none !important; */
  border: none !important;
  overflow-x: hidden;
}
.random_period_selection {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.random_period {
  display: flex;
  align-items: center;
  gap: 8px;
}
.checkbox {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background-color: #ecf0f3;
  border-radius: 6px;
  border: 1px solid var(--generalBrandLight);
  position: relative;
  cursor: pointer;
  outline: none;
  transition: 0.3s;
}
.checkbox:checked {
  background-color: var(--generalBrand);
  background-image: url("@/assets/checkMark.png");
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.1s;
}
.range_period {
  display: flex;
  align-items: center;
  gap: 8px;
}
.range_input {
  width: 135px;
}
.input-slot-image {
  width: 24px;
  margin: 6px 6px 0 0;
}
.analytics_page_my_pulse_chart {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  width: auto !important;
  height: 100%;
  padding: 52px;
  background: var(--generalColorWhite);
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  border-radius: 24px 0 0 0;
  margin: 20px 0 0 0;
  overflow-y: auto;
}
.analytics_page_my_pulse_chart::-webkit-scrollbar {
  width: 8px;
}
.analytics_page_my_pulse_chart::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
@media (max-width: 1280px) {
  .analytics_page_my_pulse_chart {
    padding: 24px !important;
  }
}
@media (max-width: 1100px) {
  .analytics_page_my_pulse_header {
    flex-wrap: wrap;
  }
}
@media (max-width: 768px) {
  .analytics_page_my_pulse_header {
    flex-direction: column;
    align-items: flex-start;
  }
}

.close_icon {
  margin: 3px 0 0 0;
}
</style>