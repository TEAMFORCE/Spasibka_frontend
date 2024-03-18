<template>
  <div class="bottom_bar_tablet general-white-bg">
    <BottomBarTabletMore
      v-if="seeMoreActive"
      :isAdmin="userRole === 'Администратор'"
      :isSuperuser="profileInfo?.superuser"
      @closeSeeMore="closeSeeMore"
    />
    <div 
      class="bottom_bar_button"
      v-for="link in links"
    >
      <router-link v-if="link.url" :to="link.url">
        <a :href="link.url">
          <div class="link_to_page">
            <!-- <img class="link_image" :src="getImgUrl(link)" /> -->
            <component
              :is="link.image"
              :currentColor="getIconColor(link)"
              class="link_image"
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
      <button
        v-else
        class="link_to_page transparent-bg"
        @click="seeMoreActive = true"
      >
        <component
          :is="link.image"
          :currentColor="getIconColor(link)"
          class="link_image"
        >
        </component>
        <h1
          class="link_name general-contrast-color"
        >
          {{ link.name }}
        </h1>
      </button>
    </div>
  </div>
</template>

<script>
import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";
import { organizationSettingsStore } from "@/store/organization-settings";

import BottomBarTabletMore from "./BottomBarTabletMore.vue";

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
import SeeMoreIcon from "../Icons/SidebarIcons/SeeMoreIcon.vue";

export default {
  components: {
    BottomBarTabletMore,
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
    SeeMoreIcon
  },
  data() {
    return {
      seeMoreActive: false,
    }
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore.profileInfo;
    },
    links() {
      let links = [
        { image: "SendThanksIcon", name: this.$t("sidebar.gratitude"), url: "/new_transfer" },
        { image: "EventsIcon", name: this.$t("sidebar.events"), url: "/feed" },
        { image: "HistoryIcon", name: this.$t("sidebar.story"), url: "/history" },
        { image: "ChallengesIcon", name: this.$t("sidebar.challenges"), url: "/challenges" },
      ];
      const store = organizationSettingsStore();
      if (store.marketsExist) {
      }
      links.push({ image: "AnalyticsIcon", name: this.$t("sidebar.analytics"), url: "/analytics" });
      if (this.userRole == "Администратор") {
        links.push(
          {
            image: "OrganizationIcon",
            name: this.$t("sidebar.organization"),
            url:
              "/organization_administration/" +
              this.profileInfo.profile.organization_id,
          }
        );
      }
      if (this.profileInfo?.superuser) {
        links.push({
          image: "SettingsIcon",
          name: this.$t("sidebar.superAdmin"),
          url: "/global_admin",
        });
      }
      links.push({
        image: "SeeMoreIcon",
        name: this.$t("sidebar.more"),
      });
      return links;
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
  },
  methods: {
    closeSeeMore() {
      this.seeMoreActive = false;
    },
    isLinkActive(link) {
      if (link.url == this.$route.path) return true;
      if (
        link.name == "Челленджи" &&
        (this.$route.name == "Challenges" ||
          this.$route.name == "ChallengeItem")
      )
        return true;
      if (
        link.name == "Организация" &&
        (this.$route.name == "OrganizationAdministration" ||
          this.$route.name == "OrganizationAdministrationSettings")
      )
        return true;
      return false;
    },
    getImgUrl(link) {
      var images = require.context(
        "@/assets/Layouts/MainLayout/Sidebar",
        false,
        /\.png$/
      );
      let imageName = link.image;
      if (this.isLinkActive(link)) imageName += "Active";
      return images("./" + imageName + ".png");
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
        link.name == "Челленджи" &&
        (this.$route.name == "Challenges" ||
          this.$route.name == "ChallengeItem")
      ) {
        return generalBrand;
      } else if (
        link.name == "Организация" &&
        (this.$route.name == "OrganizationAdministration" ||
          this.$route.name == "OrganizationAdministrationSettings")
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
.bottom_bar_tablet {
  z-index: 5000;
  position: absolute;
  bottom: 0px;
  padding: 15px;
  display: none;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  border-radius: 20px;
}
@media (max-width: 1000px) {
  .bottom_bar_tablet {
    display: flex;
    left: 22px;
    right: 24px;
  }
}
@media (max-width: 700px) {
  .link_name {
    font-size: 12px !important;
  }
}
@media (max-width: 600px) {
  .bottom_bar_tablet {
    display: none;
  }
}
.bottom_bar_button {
  flex: 1;
}
a {
  text-decoration: none;
}
.link_to_page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.link_image {
  height: 24px;
  width: 24px;
}
.link_name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  word-break: break-word;
}
.link_name.active {
  color: var(--generalBrand);
}
</style>