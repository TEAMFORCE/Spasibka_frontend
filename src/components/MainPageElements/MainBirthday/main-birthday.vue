<template >
  <div class="main_page_birthday_wrapper">
    <div class="main_page_birthday_header">
      <h3 class="main_page_birthday_title">
        {{ $t("mainPage.birthday.title") }}
      </h3>
      <h4 class="main_page_birthday_calendar" @click.stop="openOrCloseCalendar">
        {{ $t("mainPage.birthday.calendar") }}
      </h4>
      <Transition>
        <div
          class="main_page_birthday_calendar_body"
          v-if="calendarVisible"
          v-click-outside="openOrCloseCalendar"
        >
          <Datepicker
            @tooltip-open="onTooltipOpen"
            :markers="tooltipMarkers"
            v-model="dateRange"
            inline
            auto-apply
            format="yyyy.MM.dd"
            locale="ru"
            position="left"
            range
            :clearable="true"
            :placeholder="$t('analyticsPage.reports.inputs.searchByDate')"
            :enable-time-picker="false"
            :highlight="highlightedDates"
            ref="datePicker"
          >
          </Datepicker>
          <div
            class="clear_calendar_button"
            :class="{ active: dateRange }"
            @click="clearRange"
          >
            <span class="clear_calendar_button_title">
              {{ $t("mainPage.birthday.clear") }}
            </span>
          </div>
        </div>
      </Transition>
    </div>

    <div class="main_page_birthday_body">
      <h2 class="no_birthday" v-if="birthdaysList.length <= 0">
        {{ $t("mainPage.birthday.noBirthdays") }}
      </h2>
      <carousel :breakpoints="breakpoints" :itemsToScroll="1" v-else>
        <slide v-for="slide in birthdaysList" :key="slide">
          <BirthdayEmployeeCard :employeeBirthday="slide" />
        </slide>

        <template #addons>
          <navigation />
          <!-- <pagination /> -->
        </template>
      </carousel>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import Datepicker from "@vuepic/vue-datepicker";

import BirthdayEmployeeCard from "./main-birthday-slider-item.vue";

export default {
  name: "MainPageBirthday",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
    Datepicker,
    BirthdayEmployeeCard,
  },
  data() {
    return {
      calendarVisible: false,
      // itemToShow: null,
      windowWidth: window.innerWidth,
      breakpoints: {
        3840: { itemsToShow: 10, snapAlign: "start" },
        3000: { itemsToShow: 9, snapAlign: "start" },
        2800: { itemsToShow: 8, snapAlign: "start" },
        2240: { itemsToShow: 7, snapAlign: "start" },
        1920: { itemsToShow: 6, snapAlign: "start" },
        1660: { itemsToShow: 5, snapAlign: "start" },
        1400: { itemsToShow: 4, snapAlign: "start" },
        1120: { itemsToShow: 3, snapAlign: "start" },
        600: { itemsToShow: 2, snapAlign: "start" },
        320: { itemsToShow: 1, snapAlign: "start" },
      },
      birthdaysList: [],
      dateRange: null,
      dateFrom: null,
      dateTo: null,

      highlightedDates: [],
      tooltipMarkers: [],
    };
  },
  mounted() {
    setTimeout(() => this.getBirthdays(), 1000);
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
  },

  watch: {
    profileInfo() {
      this.getBirthdays();
    },
    dateRange() {
      this.dateFrom = null;
      this.dateTo = null;
      if (this.dateRange) {
        this.dateFrom = this.dateRange[0].toISOString().slice(0, 10);
        this.dateTo = this.dateRange[1].toISOString().slice(0, 10);
        this.openOrCloseCalendar();
      }
      this.getBirthdays();
    },
  },
  methods: {
    onTooltipOpen() {},
    clearRange() {
      this.dateRange = null;
      this.openOrCloseCalendar();
    },
    openOrCloseCalendar() {
      if (this.calendarVisible) {
        this.tooltipMarkers = [];
      }
      setTimeout(() => {
        this.calendarVisible ^= true;
        if (this.calendarVisible) {
          this.getCurrentMonthBirthdays();
        }
      }, 30);
    },
    async getCurrentMonthBirthdays() {
      // let currentDate = new Date();
      // const daysToMilliseconds = (days) => days * 24 * 60 * 60 * 1000;
      // let pastDate = new Date(currentDate.getTime() - daysToMilliseconds(366));
      // let futureDate = new Date(currentDate.getTime() + daysToMilliseconds(366));
      // pastDate = pastDate.toISOString().slice(0, 10);
      // futureDate = futureDate.toISOString().slice(0, 10);
      try {
        let params = {
          organization_id: this.profileInfo.profile.organization_id,
          date_from: "2023-01-01",
          date_to: "2023-12-31",
        };
        const response = await axios.get(API_URIS.employeesBirthdays, {
          params,
        });
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < response.data.length; ++i) {
          let month = response.data[i].month_of_birth;
          let day = response.data[i].day_of_birth;
          let previousYearDate = new Date(currentYear - 1, month - 1, day);
          let currentYearDate = new Date(currentYear, month - 1, day);
          let nextYearDate = new Date(currentYear + 1, month - 1, day);
          previousYearDate = this.formatDate(previousYearDate);
          currentYearDate = this.formatDate(currentYearDate);
          nextYearDate = this.formatDate(nextYearDate);
          // this.highlightedDates.push(previousYearDate);
          // this.highlightedDates.push(currentYearDate);
          // this.highlightedDates.push(nextYearDate);
          let wasPreviously = false;
          for (let j = 0; j < this.tooltipMarkers.length; ++j) {
            if (this.tooltipMarkers[j].date == previousYearDate) {
              wasPreviously = true;
              this.tooltipMarkers[j].tooltip.push({
                text: response.data[i].first_name
                  ? response.data[i].first_name + " " + response.data[i].surname
                  : response.data[i].nickname,
                color: "#F15929",
              });
            }
            if (this.tooltipMarkers[j].date == currentYearDate) {
              this.tooltipMarkers[j].tooltip.push({
                text: response.data[i].first_name
                  ? response.data[i].first_name + " " + response.data[i].surname
                  : response.data[i].nickname,
                color: "#F15929",
              });
            }
            if (this.tooltipMarkers[j].date == nextYearDate) {
              this.tooltipMarkers[j].tooltip.push({
                text: response.data[i].first_name
                  ? response.data[i].first_name + " " + response.data[i].surname
                  : response.data[i].nickname,
                color: "#F15929",
              });
            }
          }

          if (!wasPreviously) {
            this.tooltipMarkers.push({
              date: previousYearDate,
              type: "line",
              tooltip: [
                {
                  text: response.data[i].first_name
                    ? response.data[i].first_name +
                      " " +
                      response.data[i].surname
                    : response.data[i].nickname,
                  color: "#F15929",
                },
              ],
            });
            this.tooltipMarkers.push({
              date: currentYearDate,
              type: "line",
              tooltip: [
                {
                  text: response.data[i].first_name
                    ? response.data[i].first_name +
                      " " +
                      response.data[i].surname
                    : response.data[i].nickname,
                  color: "#F15929",
                },
              ],
            });
            this.tooltipMarkers.push({
              date: nextYearDate,
              type: "line",
              tooltip: [
                {
                  text: response.data[i].first_name
                    ? response.data[i].first_name +
                      " " +
                      response.data[i].surname
                    : response.data[i].nickname,
                  color: "#F15929",
                },
              ],
            });
          }
        }
      } catch (err) {
        throw err;
      }
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    async getBirthdays() {
      try {
        let params = {
          organization_id: this.profileInfo.profile.organization_id,
          date_from: this.dateFrom,
          date_to: this.dateTo,
        };
        await axios
          .get(API_URIS.employeesBirthdays, { params })
          .then((res) => {
            this.birthdaysList = res.data;
          })
          .catch((err) => {
            throw err;
          });
      } catch (error) {
        throw error;
      }
    },
  },
};
</script>

<style >
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.carousel__prev {
  width: 44px;
  height: 44px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 100%;
  left: -30px;
}
.carousel__next {
  width: 44px;
  height: 44px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 100%;
  right: -30px;
}
.carousel__prev.carousel__prev--disabled {
  display: none !important;
}
.carousel__next.carousel__next--disabled {
  display: none !important;
}
.main_page_birthday_wrapper {
  background-color: var(--generalColorWhite);
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  padding: 52px 52px 52px 52px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}
.main_page_birthday_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  position: relative;
}
.main_page_birthday_title {
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  color: var(--generalContrast);
  margin: 0;
}
.main_page_birthday_calendar {
  font-family: "Golos";
  font-weight: 400 !important;
  font-size: 20px;
  color: var(--generalBrand);
  margin: 0;
  transition: 0.3s;
}
.main_page_birthday_calendar:hover {
  color: #e43500;
  cursor: pointer;
}
.main_page_birthday_calendar_body {
  position: absolute;
  right: 0;
  top: 60px;
  z-index: 1000;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--generalColorWhite);
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}
.clear_calendar_button {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: var(--generalColorGrey);
  cursor: pointer;
  transition: 0.3s;
}
.clear_calendar_button.active {
  background-color: var(--generalBrand);
}
.clear_calendar_button_title {
  font-family: "Golos";
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--generalColorWhite);
}
.main_page_birthday_body {
  width: 100%;
}
.no_birthday {
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  color: var(--generalContrast);
}
.box {
  width: 255px;
  height: 388px;
  border-radius: 20px;
  border: 1px solid var(--generalBrand);
}
@media (max-width: 1280px) {
  .main_page_birthday_wrapper {
    padding: 24px;
  }
}
@media (max-width: 768px) {
  .main_page_birthday_header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .main_page_birthday_calendar_body {
    top: 80px;
  }
}
</style>