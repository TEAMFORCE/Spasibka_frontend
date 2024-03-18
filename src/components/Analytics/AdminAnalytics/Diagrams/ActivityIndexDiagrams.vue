<template>
  <div class="user_activity_diagrams">
    <Loading
      class="spinner_loader"
      :active="isLoading"
      :isFullPage="false"
      ref="spinnerLoader"
    />
    <div
      class="analytics_page_reports_filters"
    >
      <div
        v-for="item in analyticsReportsFilters"
        class="reports_filters_item"
        @click="changeFilter(item)"
      >
        <span
          class="reports_filters_item_text"
          :class="{ active: item.name === activeFilter }"
        >
          {{ getItemTitle(item.title) }}
        </span>
      </div>
    </div>
    <UserActivityAllDiagrams
      v-if="activeFilter === 'all'"
      :isLoading="isLoading"
      @isLoading="isLoading = true"
      @finishedLoading="isLoading = false"
    />
    <UserActivityThanksDiagrams
      v-if="activeFilter === 'thanks'"
      :isLoading="isLoading"
      @isLoading="isLoading = true"
      @finishedLoading="isLoading = false"
    />
    <UserActivityChallengesDiagrams
      v-if="activeFilter === 'challenges'"
      :isLoading="isLoading"
      @isLoading="isLoading = true"
      @finishedLoading="isLoading = false"
    />
  </div>
</template>

<script>
import { API_URIS } from "@/constants/api";
import axios from "axios";
import Loading from "vue3-loading-overlay";
import BarChartChallenges from "./BarChartChallenges.vue";
import { ANALYTICS_REPORTS_FILTERS } from "@/infrastructure/data-sources/analytics-reports-filters";
import { organizationSettingsStore } from "@/store/organization-settings";
import UserActivityAllDiagrams from "./UserActivityAllDiagrams.vue";
import UserActivityThanksDiagrams from "./UserActivityThanksDiagrams.vue";
import UserActivityChallengesDiagrams from "./UserActivityChallengesDiagrams.vue";

export default {
  name: "ActivityIndexDiagrams",
  components: { Loading, BarChartChallenges, UserActivityAllDiagrams, UserActivityThanksDiagrams, UserActivityChallengesDiagrams },
  data() {
    return {
      activeFilter: "all",
      organizationSettings: organizationSettingsStore(),
      isLoading: false,
    };
  },
  mounted() {
  },
  watch: {
    isLoading: {
      handler(newVal) {
        if (newVal) this.positionLoader();
      }
    }
  },
  computed: {
    valueName() {
      return this.organizationSettings.settings.bonusname.RU.form6;
    },
    analyticsReportsFilters() {
      return ANALYTICS_REPORTS_FILTERS(this);
    },
  },
  methods: {
    positionLoader() {
      const el = document.getElementsByClassName("admin_analytics_page")[0];
      const rect = el.getBoundingClientRect();

      const loaderEl = this.$refs.spinnerLoader.$el;
      loaderEl.style.position = "fixed";
      loaderEl.style.display = "flex";
      loaderEl.style.top = `${rect.top}px`;
      loaderEl.style.left = `${rect.left}px`;
      loaderEl.style.width = `${rect.width}px`;
      loaderEl.style.height = `${rect.height}px`;
    },
    getItemTitle(title) {
      if (title == "") {
        return this.valueName;
      } else {
        return title;
      }
    },
    changeFilter(item) {
      this.activeFilter = item.name;
    },
  },
};
</script>

<style scoped>
.spinner_loader {
  z-index: 10000 !important;
}
.user_activity_diagrams {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
::v-deep(.vue-apexcharts > .apexcharts-canvas > svg) {
  overflow: visible;
  text-overflow: ellipsis;
}

.analytics_page_reports_filters {
  display: flex;
  gap: 12px;
  align-items: center;
}
.reports_filters_item_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 28px;
  color: var(--generalColorSecondary);
  transition: 0.4s;
  text-transform: capitalize;
}
.reports_filters_item_text:hover {
  color: #5f5f5f;
  cursor: pointer;
}
.reports_filters_item_text.active {
  color: var(--generalBrand);
}
</style>
