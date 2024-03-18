<template>
  <div class="period_select">
    <div class="selected_period">
      <button class="general-brand-bg" @click="clickOnPeriod">
        {{ currentPeriodText }}
      </button>
      <button class="general-brand-bg" @click="clickOnCalendar">
        <img src="@/assets/tabler_calendar.png" />
      </button>
      <button
        class="general-brand-bg"
        @click="clearPeriod"
        v-if="selectedPeriod != null"
      >
        Очистить период
      </button>
    </div>
    <div class="period_options" v-if="!periodOptionsListHidden">
      <PeriodSelectOption
        v-for="item in periodOptionsListActive"
        :key="item.id"
        :info="item"
        @applyPeriod="applyPeriod"
      />
    </div>
    <div class="period_calendar_options" v-if="!calendarHidden">
      <Calendar @selectDate="selectDate" />
    </div>
    <h6 v-if="dateNotFoundError" class="date_not_found_text">
      Периода с этой датой не существует
    </h6>
  </div>
</template>


<script>
import axios from "axios";
import PeriodSelectOption from "./PeriodSelectOption.vue";
import Calendar from "./Calendar.vue";
import { API_URIS } from "@/constants/api";

export default {
  name: "PeriodSelect",
  props: ["currentPeriod"],
  components: { PeriodSelectOption, Calendar },
  data() {
    return {
      periodOptionsListOriginal: [],
      periodOptionsListActive: [],
      periodOptionsListHidden: true,

      calendarHidden: true,

      selectedPeriod: null,
      token: null,

      dateNotFoundError: false,
      periodButtonText: "Выберите период",
    };
  },
  mounted() {
    this.token = this.$cookies.get("csrftoken");
    this.retrievePeriodsList();
  },
  computed: {
    currentPeriodText() {
      let selectedPeriod = this.selectedPeriod;
      if (selectedPeriod == null) {
        return "Выберите период";
      } else {
        return this.formatPeriod(selectedPeriod);
      }
    },
  },
  methods: {
    clearPeriod() {
      this.dateNotFoundError = false;
      this.selectedPeriod = null;
      this.$emit("clearPeriod");
      this.closeDropdowns();
    },
    refactorDate(date) {
      return date.replaceAll("-", ".");
    },
    formatPeriod(period) {
      let startDate = this.refactorDate(period.start_date);
      let endDate = this.refactorDate(period.end_date);
      return period.name + "    " + startDate + "-" + endDate;
    },
    formatDate(year, month, day) {
      let formattedMonth = month;
      let formattedDay = day;

      if (month < 10) formattedMonth = "0" + month;
      if (day < 10) formattedDay = "0" + day;

      return year + "-" + formattedMonth + "-" + formattedDay;
    },
    async selectDate(year, month, day) {
      let formattedDate = this.formatDate(year, month, day);
      try {
        let response = await axios.post(
          API_URIS.getPeriodByDateURL,
          {
            date: formattedDate,
          },
          {
            headers: {
              "X-CSRFToken": this.token,
            },
          }
        );
        this.applyPeriod(response.data);
        this.dateNotFoundError = false;
      } catch (err) {
        this.closeDropdowns();
        this.dateNotFoundError = true;
        throw err;
      }
    },
    closeDropdowns() {
      this.periodOptionsListActive = [];
      this.periodOptionsListHidden = true;
      this.calendarHidden = true;
    },
    applyPeriod(period) {
      this.selectedPeriod = period;
      this.$emit("applyPeriod", period);
      this.closeDropdowns();
    },
    async retrievePeriodsList() {
      try {
        let response = await axios.get(API_URIS.getPeriodsURL);
        this.periodOptionsListOriginal = response.data;
      } catch (err) {
        throw err;
      }
    },
    clickOnPeriod() {
      this.dateNotFoundError = false;
      if (!this.calendarHidden) {
        this.calendarHidden = true;
      }
      if (this.periodOptionsListHidden) {
        this.periodOptionsListActive = this.periodOptionsListOriginal;
        this.periodOptionsListHidden = false;
      } else {
        this.periodOptionsListActive = [];
        this.periodOptionsListHidden = true;
      }
    },
    clickOnCalendar() {
      this.dateNotFoundError = false;
      if (!this.periodOptionsListHidden) {
        this.periodOptionsListHidden = true;
      }
      if (this.calendarHidden) {
        this.calendarHidden = false;
      } else {
        this.calendarHidden = true;
      }
    },
  },
};
</script>


<style scoped>
.date_not_found_text {
  margin-top: 2px;
  margin-bottom: 0px;
  color: red;
}
.period_select {
  position: relative;
  margin: auto;
  display: flex;
  flex-direction: column;
}
.selected_period {
  display: flex;
  gap: 15px;
}
.period_options {
  top: 37px;
  position: absolute;
  z-index: 2;
  width: 150px;
  display: flex;
  flex-direction: column;
}
button:focus {
  outline: none;
}
button {
  width: 150px;
  height: 37px;
  color: white;
  border-radius: 12px;
  border-style: none;
}
</style>