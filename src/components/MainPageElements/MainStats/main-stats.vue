<template>
  <div class="main_page_stats_wrapper">
    <!-- <MainPageGrades /> -->
    <MainPageFeed/>
    <MainPageValues :valuesData="values" />
  </div>
</template>

<script>
import axios from "axios";
import { API_URIS } from "@/constants/api";

// import MainPageGrades from "@/components/MainPageElements/MainStats/main-stats-grades.vue";
import MainPageValues from "@/components/MainPageElements/MainStats/main-stats-values.vue";
import MainPageFeed from "./MainPageFeed.vue";

export default {
  name: "MainPageStats",
  components: {
    // MainPageGrades,
    MainPageFeed,
    MainPageValues,
  },
  data() {
    return {
      values: {
        employees_total: 0,
        transactions_quantity: 0,
        transactions_sum: 0,
        comments_total: 0,
        likes_total: 0,
        challenges_active_total: 0,
      },
    };
  },
  methods: {
    async getStatsValues() {
      try {
        let response = await axios.get(API_URIS.organizationStats);
        this.values = response.data;
      } catch (error) {
        throw error;
      }
    },
  },
  mounted() {
    this.getStatsValues();
  },
};
</script>

<style scoped>
.main_page_stats_wrapper {
  display: flex;
  justify-content: space-between;
  max-height: 1000px;
  gap: 32px;
}
@media (max-width: 1440px) {
  .main_page_stats_wrapper {
    flex-direction: column-reverse;
    gap: 32px;
    max-height: 1500px;
  }
}
</style>