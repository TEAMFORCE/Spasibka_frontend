<template>
  <div class="bottom_bar_mobile general-white-bg">
    <BottomBarMobileMore
      v-if="seeMoreActive"
      :isAdmin="isAdmin"
      :isSuperuser="profileInfo?.superuser"
      @closeSeeMore="closeSeeMore"
    />
    <router-link v-for="link in links" :to="link.url">
      <div
        v-if="link.name != 'Ещё'"
        class="link_to_page"
        :class="{
          new_transfer: link.name == 'Благодарность',
          active: isLinkActive(link),
        }"
      >
        <component
          :is="link.image"
          :currentColor="getIconColor(link)"
          class="link_image"
        >
        </component>
      </div>
      <button
        v-if="link.name == 'Ещё'"
        class="link_to_page transparent-bg"
        @click.prevent="seeMore"
      >
        <component
          :is="link.image"
          :currentColor="getIconColor(link)"
          class="link_image"
        >
        </component>
      </button>
    </router-link>
  </div>
</template>

<script>
import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";
import BottomBarMobileMore from "./BottomBarMobileMore.vue";

import EventsIcon from "@/components/Icons/SidebarIcons/EventsIcon.vue";
import OrganizationIcon from "@/components/Icons/SidebarIcons/OrganizationIcon.vue";
import SendThanksMobileIcon from "@/components/Icons/SidebarIcons/SendThanksMobileIcon.vue";
import HistoryIcon from "@/components/Icons/SidebarIcons/HistoryIcon.vue";
import SeeMoreIcon from "../Icons/SidebarIcons/SeeMoreIcon.vue";

export default {
  components: {
    BottomBarMobileMore,
    EventsIcon,
    OrganizationIcon,
    SendThanksMobileIcon,
    HistoryIcon,
    SeeMoreIcon
  },
  data() {
    return {
      seeMoreActive: false,
      isAdmin: false,
    };
  },
  computed: {
    ...mapStores(useProfileStore),
    profileInfo() {
      return this.profileStore.profileInfo;
    },
    links() {
      let links = [{ image: "EventsIcon", name: "События", url: "/feed" }];

      if (this.userRole == "Администратор") {
        this.isAdmin = true;
        links.push({
          image: "OrganizationIcon",
          name: "Организация",
          url:
            "/organization_administration/" +
            this.profileInfo.profile.organization_id,
        });
      } else {
        this.isAdmin = false;
      }

      links.push({
        image: "SendThanksMobileIcon",
        name: "Благодарность",
        url: "/new_transfer",
      });
      links.push({ image: "HistoryIcon", name: "История", url: "/history" });

      links.push({ image: "SeeMoreIcon", name: "Ещё", url: "/login" });

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
    getIconColor(link) {
      if (link.image === "SendThanksMobileIcon") {
        return null;
      }

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
    isLinkActive(link) {
      if (link.name == "Благодарность") return false;
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
    seeMore() {
      this.seeMoreActive = true;
    },
    closeSeeMore() {
      this.seeMoreActive = false;
    },
  },
};
</script>


<style scoped>
.bottom_bar_mobile {
  z-index: 5000;
  overflow-x: hidden;
  position: absolute;
  bottom: -17px;
  left: 0px;
  right: 0px;
  padding: 6px;
  justify-content: space-around;
  align-items: center;
  display: none;
  box-shadow: 0px -20px 24px rgba(148, 148, 148, 0.1);
  border-radius: 20px 20px 0px 0px;
}
@media (max-width: 600px) {
  .bottom_bar_mobile {
    display: flex;
  }
}
a {
  text-decoration: none;
}
.link_to_page {
  position: relative;
  padding: 11px 15.5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.link_to_page.new_transfer {
  padding: 0px;
  height: 58px;
  width: 58px;
  border-radius: 50%;
  background: linear-gradient(132.4deg, var(--generalBrand) -2.06%, var(--secondaryColorBrand) 111.97%);
}
.link_to_page.active {
  padding: 11px 15.5px;
  background-color: var(--secondaryColorBrand);
  box-shadow: 0px 10px 20px rgba(var(--generalBrandRGB), 0.3);
  border-radius: 16px;
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
}
.link_name.active {
  color: var(--generalBrand);
}
</style>