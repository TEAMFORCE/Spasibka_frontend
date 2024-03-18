<template>
  <div class="analytics_page" v-if="profileInfo">
    <div class="analytics_page_navigation">
      <button
        v-for="item in analyticsNavigation"
        class="navigation_item"
        :class="{ active: item.name === activeNavItem }"
        @click="changeNavItem(item)"
      >
        {{ item.title }}
      </button>
    </div>
    <div class="analytics_page_content">
      <AnalyticsPageMyPulse v-if="activeNavItem === 'myPulse'" />
      <AnalyticsPageCompanyPulse v-if="activeNavItem === 'companyPulse'" />
      <AnalyticsPageReports v-if="activeNavItem === 'reports'" />
      <AdminAnalytics v-if="activeNavItem === 'analyticsForAdmin'" />
    </div>
  </div>
</template>

<script>
import Defer from "@/mixins/defer";
import { defineAsyncComponent } from "vue";

import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";
import { ANALYTICS_NAVIGATION } from "@/infrastructure/data-sources/analytics-page-navigation";
import { ROLE_TYPE } from "@/infrastructure/constants/role-type";

export default {
  name: "AnalyticsPage",
  components: {
    AnalyticsPageReports: defineAsyncComponent(() =>
      import("@/components/Analytics/analytics-reports.vue")
    ),
    AnalyticsPageCompanyPulse: defineAsyncComponent(() =>
      import("@/components/Analytics/company-pulse.vue")
    ),
    AnalyticsPageMyPulse: defineAsyncComponent(() =>
      import("@/components/Analytics/my-pulse.vue")
    ),
    AdminAnalytics: defineAsyncComponent(() =>
      import("@/components/Analytics/AdminAnalytics/index.vue")
    ),
  },
  mixins: [Defer()],
  data() {
    return {
      activeNavItem: "myPulse",
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore.profileInfo;
    },
    isAdmin() {
      if (this.profileInfo?.privileged.length > 0) {
        if (
          this.profileInfo.privileged.some(
            (el) => el.role == ROLE_TYPE.admin
          ) ||
          this.profileInfo.superuser
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    analyticsNavigation() {
      return ANALYTICS_NAVIGATION(this, this.isAdmin);
    },
  },
  methods: {
    changeNavItem(item) {
      this.activeNavItem = item.name;
      this.$router.push({
        path: `/analytics`,
        query: { section: item.name },
      });
    },
  },
  created() {
    if (this.$route.query?.section) {
      this.activeNavItem = this.$route.query.section;
    }
  },
};
</script>

<style scoped>
.analytics_page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  position: relative;
}

.analytics_page_navigation {
  display: flex;
  gap: 8px;
}
.navigation_item {
  background-color: var(--generalColorWhite);
  padding: 8px 14px;
  font-family: "Roboto";
  font-weight: 400;
  font-size: 14px;
  border-radius: 12px;
  color: var(--generalContrast);
  box-shadow: 10px 9px 11px 0px rgba(0, 0, 0, 0.14);
  -webkit-box-shadow: 10px 9px 11px 0px rgba(0, 0, 0, 0.14);
  -moz-box-shadow: 10px 9px 11px 0px rgba(0, 0, 0, 0.14);
  border-radius: 12px;
}
.navigation_item.active {
  background-color: var(--generalBrand);
  color: var(--generalColorWhite);
}
.analytics_page_content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>