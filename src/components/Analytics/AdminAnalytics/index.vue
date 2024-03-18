<template>
  <div class="admin_analytics_page">
    <div class="admin_analytics_page_navigation">
      <button
        class="_navigation_item"
        v-for="(navItem, index) in adminAnalyticsNavigation"
        :key="index"
        :class="{ _active_nav: navItem.name === activeNav }"
        @click="changeNav(navItem)"
      >
        {{ navItem.title }}
      </button>
    </div>
    <div class="admin_analytics_page_content">
      <AnalyticsUserActivityDiagram v-if="activeNav === 'userActivity'" />
      <ChallengesDiagrams v-if="activeNav === 'challenges'" />
      <AnalyticsBenefitsDiagram v-if="activeNav === 'benefits'" />
      <ProgressStatisticsDiagram v-if="activeNav === 'progressStatistics'" />
      <ActivityIndexDiagrams v-if="activeNav === 'rating'" />
    </div>
  </div>
</template>

<script>
import { ADMIN_ANALYTICS_NAVIGATION } from "@/infrastructure/data-sources/analytics-page-admin-analytics-navigation";

import AnalyticsUserActivityDiagram from "@/components/Analytics/AdminAnalytics/Diagrams/UserActivityDiagram.vue";
import ChallengesDiagrams from "./Diagrams/ChallengesDiagrams.vue";
import AnalyticsBenefitsDiagram from "@/components/Analytics/AdminAnalytics/Diagrams/BenefitsDiagram.vue";
import ProgressStatisticsDiagram from "@/components/Analytics/AdminAnalytics/Diagrams/ProgressStatisticsDiagram.vue";
import ActivityIndexDiagrams from "./Diagrams/ActivityIndexDiagrams.vue";

export default {
  name: "AdminAnalytics",
  components: {
    AnalyticsUserActivityDiagram,
    ChallengesDiagrams,
    AnalyticsBenefitsDiagram,
    ProgressStatisticsDiagram,
    ActivityIndexDiagrams,
  },
  directives: {
    scrollEnd: {
      mounted(el, binding) {
        const handler = () => {
          let tolerance = 0.1;
          if (el.scrollTop + el.clientHeight + tolerance >= el.scrollHeight) {
            binding.value();
          }
        };
        el.addEventListener("scroll", handler);
        el._handleScroll = handler;
      },
      beforeUnmount(el) {
        el.removeEventListener("scroll", el._handleScroll);
      },
    },
  },
  data() {
    return {
      activeNav: "userActivity",

      isBottom: false,
    };
  },
  computed: {
    adminAnalyticsNavigation() {
      return ADMIN_ANALYTICS_NAVIGATION(this);
    },
  },
  methods: {
    changeNav(navItem) {
      this.activeNav = navItem.name;
    },
  },
};
</script>

<style scoped>
.admin_analytics_page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  padding: 52px;
  background: var(--generalColorWhite);
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  border-radius: 24px 0 0 0;
  box-sizing: border-box;
  overflow-y: auto;
}
.admin_analytics_page::-webkit-scrollbar {
  width: 8px;
}
.admin_analytics_page::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
@media (max-width: 1280px) {
  .admin_analytics_page {
    padding: 24px;
  }
}
.admin_analytics_page_navigation {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
._navigation_item {
  background-color: transparent;
  outline: none;
  font-family: "Golos";
  font-size: 18px;
  font-weight: 500;
  line-height: 36px;
  color: var(--generalColorSecondary);
}
._active_nav {
  color: var(--generalContrast);
}
.admin_analytics_page_content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
}
</style>