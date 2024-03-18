<template>
  <div class="analytics_page_company_pulse">
    <div class="analytics_page_company_pulse_header">
      <div class="period_selector">
        <vSelect
          class="style-chooser"
          v-model="selectedPeriod"
          :options="periodList"
          :placeholder="$t('analyticsPage.myPulse.choosePeriod')"
          label="name"
        />
        <vSelect
          class="style-chooser"
          v-model="selectedDepartment"
          :options="organizationDepartments"
          :placeholder="$t('analyticsPage.myPulse.chooseDepartment')"
          label="name"
        />
      </div>
      <div class="random_period_selector">
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
    <div class="analytics_page_company_pulse_chart">
      <CompanyPulseChart :values="organizationPulse" />
      <CompanyPulseStats :valuesData="organizationPulse" />
      <EmployeesMap />
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

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

export default {
  name: "AnalyticsPageCompanyPulse",
  components: {
    vSelect,
    Datepicker,
    CompanyPulseChart: defineAsyncComponent(() =>
      import("./Pulse/company-pulse-chart.vue")
    ),
    CompanyPulseStats: defineAsyncComponent(() =>
      import("./Pulse/company-pulse-stats.vue")
    ),
    EmployeesMap: defineAsyncComponent(() =>
      import("../MainPageElements/main-map.vue")
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
      organizationPulse: [],
      organizationDepartments: [],
      selectedDepartment: null,
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
  },
  watch: {
    profileInfo() {
      this.getOrganizationDepartments();
    },
    randomPeriod() {
      if (this.randomPeriod) {
        this.selectedPeriod = null;
      } else {
        this.dateRangeStart = null;
        this.dateRangeEnd = null;
        this.getPulse();
      }
    },
    selectedDepartment() {
      this.getPulse();
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
    async getOrganizationDepartments() {
      try {
        const response = await axios.post(API_URIS.getOrganizationDepartments, {
          organization_id: this.profileInfo?.profile.organization_id,
        });
        this.organizationDepartments = response.data;
        this.organizationDepartments.sort((a, b) => {
          if (a.name > b.name) return 1;
          else return -1;
        });
      } catch (err) {
        throw err;
      }
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
        if (this.selectedDepartment) {
          params.department_id = this.selectedDepartment.id;
        }
        let response = await axios.get(API_URIS.organizationPulse, { params });
        this.organizationPulse = response.data;
      } catch (err) {
        throw err;
      }
    },
  },
  mounted() {
    this.getPeriods();
    if (this.profileInfo) this.getOrganizationDepartments();
  },
};
</script>

<style scoped>
.analytics_page_company_pulse {
  overflow: hidden;
  height: 100%;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.analytics_page_company_pulse_header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.style-chooser {
  width: 50% !important;
}
.period_selector {
  display: flex;
  gap: 20px;
  width: 600px;
}
.vs__dropdown-toggle {
  border: none;
}
.vs__dropdown-menu {
  /* box-shadow: none !important; */
  border: none !important;
  overflow-x: hidden;
}
.random_period_selector {
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
.analytics_page_company_pulse_chart {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  gap: 32px;
  width: auto !important;
  padding: 52px 52px 100px 52px;
  background: var(--generalColorWhite);
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  border-radius: 24px 0 0 0;
  margin: 20px 0 0 0;
  box-sizing: border-box;
  overflow-y: auto;
}
.analytics_page_company_pulse_chart::-webkit-scrollbar {
  width: 8px;
}
.analytics_page_company_pulse_chart::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}

@media (max-width: 1150px) {
  .analytics_page_company_pulse_header {
    flex-wrap: wrap;
  }
}
@media (max-width: 750px) {
  .analytics_page_company_pulse {
    margin-bottom: 120px;
  }
  .style-chooser {
    width: 100% !important;
  }
  .period_selector {
    flex-wrap: wrap;
    width: 100%;
    max-width: 300px;
  }
  .analytics_page_company_pulse_header {
    flex-direction: column;
    align-items: flex-start;
  }
  .company_pulse_chart {
    flex-wrap: wrap;
  }
  .analytics_page_company_pulse_chart {
    padding: 24px !important;
  }
}
.close_icon {
  margin: 3px 0 0 0;
}
</style>