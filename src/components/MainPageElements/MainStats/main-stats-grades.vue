<template>
  <div class="main_stats_grades_wrapper">
    <h3 class="main_stats_grades_title">{{ $t("mainPage.thanks.title") }}</h3>
    <div class="main_stats_grades_tab_panel">
      <button
        v-for="item in statsGradesNavigation"
        class="tab_item"
        :class="{ active: item.name === activeTab }"
        @click="changeTab(item)"
      >
        {{ item.title }}
      </button>
    </div>
    <div class="main_stats_grades_items" v-if="allEvents && activeTab == 'all'">
      <div v-for="item in allEvents">
        <GradesThanksItem v-if="item.transaction" :thanksData="item" />
        <GradesChallengeItem v-if="item.challenge" :challengeData="item" />
        <GradesWinnerItem v-if="item.winner" :winnerData="item" />
        <!-- <GradesThanksItem v-if="item.selector === 'T'" :thanksData="item" />
        <GradesChallengeItem v-if="item.selector === 'Q'" :challengeData="item" />
        <GradesWinnerItem v-if="item.selector === 'R'" :winnerData="item" /> -->
      </div>
    </div>
    <div
      class="main_stats_grades_items"
      v-if="thanksEvents && activeTab == 'thanks'"
    >
      <GradesThanksItem v-for="item in thanksEvents" :thanksData="item" />
    </div>
    <div
      class="main_stats_grades_items"
      v-if="challengeEvents && activeTab == 'challenges'"
    >
      <GradesChallengeItem
        v-for="item in challengeEvents"
        :challengeData="item"
      />
    </div>
    <div
      class="main_stats_grades_items"
      v-if="winnersEvents && activeTab == 'winners'"
    >
      <GradesWinnerItem v-for="item in winnersEvents" :winnerData="item" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";
import { EVENT_NAVIGATION } from "@/infrastructure/data-sources/main-page-event-navigation";

import GradesThanksItem from "@/components/MainPageElements/MainStats/MainStatsGradesItems/main-stats-grades-thanks-item.vue";
import GradesChallengeItem from "@/components/MainPageElements/MainStats/MainStatsGradesItems/main-stats-grades-challenge-item.vue";
import GradesWinnerItem from "@/components/MainPageElements/MainStats/MainStatsGradesItems/main-stats-grades-winners-item.vue";

export default {
  name: "MainPageGrades",
  components: {
    GradesThanksItem,
    GradesChallengeItem,
    GradesWinnerItem,
  },
  data() {
    return {
      activeTab: "all",
      allEvents: null,
      thanksEvents: null,
      challengeEvents: null,
      winnersEvents: null,
    };
  },
  computed: {
    statsGradesNavigation() {
      return EVENT_NAVIGATION(this);
    },
  },
  watch: {
    activeTab() {
      if (this.activeTab == "thanks") {
        this.getTransactionEvents();
      } else if (this.activeTab == "challenges") {
        this.getChallengesEvents();
      } else if (this.activeTab == "winners") {
        this.getWinnersEvents();
      }
    },
  },
  methods: {
    changeTab(item) {
      this.activeTab = item.name;
    },
    async getAllEvents() {
      let params = {
        offset: 1,
        limit: 5,
      };
      try {
        // let response = await axios.get(API_URIS.eventsNew, { params });
        // this.allEvents = response?.data?.data;
        let response = await axios.get(API_URIS.events, { params });
        this.allEvents = response.data;
      } catch (error) {
        throw error;
      }
    },
    async getTransactionEvents() {
      try {
        let params = {
          offset: 1,
          limit: 5,
        };
        let response = await axios.get(API_URIS.eventsTransactions, { params });
        this.thanksEvents = response.data;
      } catch (error) {
        throw error;
      }
    },
    async getChallengesEvents() {
      try {
        let params = {
          offset: 1,
          limit: 6,
        };
        let response = await axios.get(API_URIS.eventsChallenges, { params });
        this.challengeEvents = response.data;
      } catch (error) {
        throw error;
      }
    },
    async getWinnersEvents() {
      try {
        let params = {
          offset: 1,
          limit: 6,
        };
        let response = await axios.get(API_URIS.eventsWinners, { params });
        this.winnersEvents = response.data;
      } catch (error) {
        throw error;
      }
    },
  },
  mounted() {
    this.getAllEvents();
  },
};
</script>

<style scoped>
.main_stats_grades_wrapper {
  width: 62%;
  max-height: 1000px !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  border-radius: 24px;
  padding: 52px;
  background-color: var(--generalColorWhite);
}
.main_stats_grades_title {
  font-family: "Golos";
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  color: var(--generalContrast);
  margin: 0;
}
.main_stats_grades_tab_panel {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tab_item {
  background-color: var(--minorInfoSecondaryColor);
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 400;
  font-family: "Roboto";
  border-radius: 12px;
  color: var(--generalContrast);
}
.tab_item.active {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
.main_stats_grades_items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 740px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.main_stats_grades_items::-webkit-scrollbar {
  display: none;
}
@media (max-width: 1600px) {
  .main_stats_grades_wrapper {
    width: 56%;
  }
}
@media (max-width: 1440px) {
  .main_stats_grades_wrapper {
    width: auto;
    border-radius: 0;
    border-top-left-radius: 24px;
    border-bottom-left-radius: 24px;
  }
}
@media (max-width: 1280px) {
  .main_stats_grades_wrapper {
    padding: 24px;
    width: auto !important;
  }
}
@media (max-width: 768px) {
  .main_stats_grades_wrapper {
    width: auto;
  }
}
</style>