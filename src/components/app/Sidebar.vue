<template>
  <div class="sidebar">
    <router-link
      class="router_link"
      v-for="link in appNavigation"
      :to="link.url"
    >
      <a :href="link.url">
        <div class="link_to_page">
          <component
            :is="link.image"
            :currentColor="getIconColor(link)"
            class="display_flex"
          ></component>
          <h1
            class="link_name general-contrast-color"
            :class="{ active: isLinkActive(link) }"
          >
            {{ link.name }}
          </h1>
        </div>
      </a>
    </router-link>
  </div>
</template>

<script>
import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";
import { organizationSettingsStore } from "@/store/organization-settings";

import { APP_NAVIGATION } from "@/infrastructure/data-sources/app-navigation";

import SendThanksIcon from "@/components/Icons/SidebarIcons/SendThanksIcon.vue";
import EventsIcon from "@/components/Icons/SidebarIcons/EventsIcon.vue";
import HistoryIcon from "@/components/Icons/SidebarIcons/HistoryIcon.vue";
import ChallengesIcon from "@/components/Icons/SidebarIcons/ChallengesIcon.vue";
import AwardsIcon from "@/components/Icons/SidebarIcons/AwardsIcon.vue";
import MarketIcon from "@/components/Icons/SidebarIcons/MarketIcon.vue";
import EmployeesIcon from "@/components/Icons/SidebarIcons/EmployeesIcon.vue";
import AnalyticsIcon from "@/components/Icons/SidebarIcons/AnalyticsIcon.vue";
import OrganizationIcon from "@/components/Icons/SidebarIcons/OrganizationIcon.vue";
import SettingsIcon from "@/components/Icons/SidebarIcons/SettingsIcon.vue";
import SurveysIcon from "../Icons/SidebarIcons/SurveysIcon.vue";

export default {
  components: {
    SendThanksIcon,
    EventsIcon,
    HistoryIcon,
    ChallengesIcon,
    AwardsIcon,
    MarketIcon,
    EmployeesIcon,
    AnalyticsIcon,
    OrganizationIcon,
    SettingsIcon,
    SurveysIcon,
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore.profileInfo;
    },
    marketsExist() {
      if (this.organizationSettings.marketsExist) {
        return true;
      } else {
        return false;
      }
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
    appNavigation() {
      return APP_NAVIGATION(
        this,
        this.marketsExist,
        this.userRole,
        this.profileInfo?.profile?.organization_id,
        this.profileInfo?.superuser
      );
    },
  },
  methods: {
    isLinkActive(link) {
      if (link.url == this.$route.path) return true;
      if (
        link.name == this.$t("sidebar.challenges") &&
        (this.$route.name == "Challenges" ||
          this.$route.name == "ChallengeItem" ||
          this.$route.name == "AllChallenges")
      )
        return true;
      if (
        link.name == this.$t("sidebar.organization") &&
        (this.$route.name == "OrganizationAdministration" ||
          this.$route.name == "OrganizationAdministrationSettings")
      )
        return true;
      if (
        link.name == this.$t("sidebar.surveys") &&
        (this.$route.name == "AdminSurveys" ||
          this.$route.name == "SurveyPreview" ||
          this.$route.name === "Survey" ||
          this.$route.name === "SurveyManagement" ||
          this.$route.name === "TestManagement")
      )
        return true;
      return false;
    },
    getIconColor(link) {
      let generalBrand = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalBrand");
      let generalContrast = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalContrast");

      if (link.url == this.$route.path) {
        return generalBrand;
      } else if (
        link.name == this.$t("sidebar.challenges") &&
        (this.$route.name == "Challenges" ||
          this.$route.name == "ChallengeItem" ||
          this.$route.name == "AllChallenges")
      ) {
        return generalBrand;
      } else if (
        link.name == this.$t("sidebar.organization") &&
        (this.$route.name == "OrganizationAdministration" ||
          this.$route.name == "OrganizationAdministrationSettings")
      ) {
        return generalBrand;
      } else if (
        link.name == this.$t("sidebar.surveys") &&
        (this.$route.name == "AdminSurveys" ||
          this.$route.name == "SurveyPreview" ||
          this.$route.name === "Survey" ||
          this.$route.name === "SurveyManagement" ||
          this.$route.name === "TestManagement")
      ) {
        return generalBrand;
      } else {
        return generalContrast;
      }
    },
  },
};
</script>


<style scoped>
.sidebar {
  width: 206px;
  padding: 0 27px 0px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
}
@media (max-width: 1000px) {
  .router_link {
    display: none;
  }
  .sidebar {
    width: 24px;
    padding: 0px;
  }
}
@media (max-width: 550px) {
  .sidebar {
    width: 16px;
  }
}
a {
  text-decoration: none;
}
.link_to_page {
  display: flex;
  align-items: center;
  gap: 8px;
}
.display_flex {
  display: flex;
  align-items: center;
}
.link_image {
  height: 24px;
  width: 24px;
}
.link_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}
.link_name.active {
  color: var(--generalBrand);
}
.balance_icon {
  width: 18px;
  height: 14px;
}
.events_icon {
  width: 16px;
  height: 16px;
}
.history_icon {
  width: 18px;
  height: 18px;
}
.challenges_icon {
  width: 17px;
  height: 18px;
}
.benefit_icon {
  width: 18px;
  height: 18px;
}
.participants_icon {
  width: 18px;
  height: 18px;
}
.analytics_icon {
  width: 18px;
  height: 18px;
}
.organization_icon {
  width: 18px;
  height: 17px;
}
.settings_icon {
  width: 18px;
  height: 18px;
}
</style>