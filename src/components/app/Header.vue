<template>
  <div class="header">
    <div class="quit_confirmation_wrapper" v-if="logoutWindowEnabled">
      <div class="quit_confirmation general-white-bg general-contrast-color">
        {{ $t("header.are_you_sure_to_quit") }}
        <div class="action_buttons">
          <button
            @click="quit"
            class="action_button general-brand-bg general-white-color"
          >
            {{ $t("header.yes") }}
          </button>
          <button
            class="action_button brand-secondary-bg general-brand-color"
            @click="cancelQuit"
          >
            {{ $t("header.cancel") }}
          </button>
        </div>
      </div>
    </div>
    <Relogin
      :organizations="organizations"
      @cancelRelogin="cancelRelogin"
      v-if="organizationChangeFormEnabled"
      :initialLogin="false"
    />
    <router-link :to="'/main'">
      <button class="main_page_button transparent-bg">
        <img class="main_page_logo" :src="headerLogo" />
      </button>
    </router-link>
    <div v-if="changesSaved" class="changes_saved general-contrast-color">
      <ChangesSavedIcon class="changes_saved_icon" />
      {{ $t("surveys.all_changes_saved") }}
    </div>
    <div class="profile_and_exit">
      <div class="profile" v-if="!isOnboarding">
        <!-- <button
          v-if="!isOnboarding"
          @click="enableOrganizationChange"
          class="relogin_button general-white-bg"
        >
          <h1 class="relogin_button_text general-contrast-color">
            Сменить организацию
          </h1>
        </button> -->
        <div class="profile_info">
          <h1 class="name general-contrast-color">{{ displayedName }}</h1>
          <h1 class="role general-secondary-color">{{ displayedRole }}</h1>
        </div>
        <button @click="goToProfile" class="profile_or_exit_button">
          <img class="profile_or_exit_button_image" :src="profilePicture" />
        </button>
      </div>
      <div
        class="notifications_wrapper"
        v-if="$route.name !== 'OnboardingPage'"
        v-click-outside="closeNotifications"
      >
        <button
          @click="openOrCloseNotifications"
          class="profile_or_exit_button tooltip_container"
          :class="{
            'general-brand-bg': notificationsEnabled,
            'general-white-bg': !notificationsEnabled,
          }"
          :data-tooltip="$t('header.notifications')"
        >
          <NotificationsIcon
            class="notifications_icon"
            :currentColor="notificationsIconColor"
          />
          <div
            class="notifications_count minor-error-bg general-white-color"
            v-if="!isActivePeriod && !notificationsEnabled"
          >
            1
          </div>
        </button>
        <NotificationsList v-if="notificationsEnabled" />
      </div>

      <button
        @click="logout"
        class="profile_or_exit_button tooltip_container general-white-bg"
        :data-tooltip="$t('header.logout')"
      >
        <LogoutIcon :currentColor="getIconColor()" />
      </button>
    </div>
  </div>
</template>

<script>
import { useStore as useProfileStore } from "@/store/profile";
import { useStore as useSurveyStore } from "@/store/SurveyStore/index";
import { useStore as useTestStore } from "@/store/TestStore/index";
import { mapStores } from "pinia";

import { API_URIS, SERVER_IP } from "@/constants/api";
import { getImageURL } from "@/general-scripts/get-image-url";

import { organizationSettingsStore } from "@/store/organization-settings";

import axios from "axios";
import Relogin from "../ReloginElements/Relogin.vue";

import LogoutIcon from "@/components/Icons/logout.vue";
import NotificationsIcon from "@/components/Icons/HeaderIcons/NotificationsIcon.vue";
import NotificationsList from "@/components/HeaderElements/NotificationsList.vue";
import ChangesSavedIcon from "../Icons/SurveyIcons/ChangesSavedIcon.vue";

export default {
  components: {
    Relogin,
    LogoutIcon,
    NotificationsIcon,
    NotificationsList,
    ChangesSavedIcon,
  },
  props: {
    isOnboarding: {
      default: false,
    },
  },
  data() {
    return {
      organizationSettings: organizationSettingsStore(),

      organizationChangeFormEnabled: false,
      notificationsEnabled: false,
      organizations: [],

      logoutWindowEnabled: false,
    };
  },

  computed: {
    changesSaved() {
      if (this.$route.name === "SurveyManagement") {
        if (
          (!this.$route.query.section ||
            this.$route.query.section === "questions") &&
          this.surveyStore.changesSaved
        )
          return true;
        return false;
      } else if (this.$route.name === "TestManagement") {
        if (
          (!this.$route.query.section ||
            this.$route.query.section === "questions") &&
          this.testStore.changesSaved
        )
          return true;
        return false;
      } else {
        return false;
      }
    },
    notificationsIconColor() {
      if (this.notificationsEnabled) {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalColorWhite"
        );
      } else {
        return getComputedStyle(document.documentElement).getPropertyValue(
          "--generalBrand"
        );
      }
    },
    isActivePeriod() {
      return this.organizationSettings?.isActivePeriod;
    },
    ...mapStores(useProfileStore),
    ...mapStores(useSurveyStore),
    ...mapStores(useTestStore),
    profileInfo() {
      return this.profileStore.profileInfo;
    },
    headerLogo() {
      if (this.organizationSettings?.settings?.photo2) {
        return SERVER_IP + this.organizationSettings?.settings?.photo2;
      } else {
        return this.getImageURL("MainLayoutImages", "HeaderLogo.svg");
      }
    },
    displayedName() {
      let fullName = "";
      if (
        this.profileInfo?.profile.first_name ||
        this.profileInfo?.profile.surnane
      ) {
        if (this.profileInfo?.profile.first_name) {
          fullName = this.profileInfo.profile.first_name;
          if (this.profileInfo?.profile.surname) fullName += " ";
        }
        if (this.profileInfo?.profile.surname) {
          fullName += this.profileInfo.profile.surname;
        }
      } else if (this.profileInfo?.profile.nickname) {
        fullName = this.profileInfo.profile.nickname;
      } else if (this.profileInfo?.profile.tg_name) {
        fullName = this.profileInfo.profile.tg_id;
      }
      return fullName;
    },
    displayedRole() {
      let role = "";
      for (let i = 0; i < this.profileInfo?.privileged.length; ++i) {
        let curRole = this.profileInfo.privileged[i];
        role = curRole.role;
        if (role === "A") {
          break;
        }
      }
      if (role === "A") {
        return this.$t("roles.admin");
      } else if (role == "") {
        return this.$t("roles.user");
      }
    },
    profilePicture() {
      const photo = this.profileInfo?.profile.photo;
      if (photo) return this.photoAddress(photo);
      else return this.getImgUrl("NoUserPhoto");
    },
    exitImage() {
      return this.getImgUrl("Exit");
    },
  },
  methods: {
    async getCurrentPeriod() {
      try {
        const response = await axios.get(API_URIS.getCurrentPeriod);
        const store = organizationSettingsStore();
        store.setIsActivePeriod(true);
        store.setPeriodStartDate(response.data.start_date);
        store.setPeriodEndDate(response.data.end_date);
      } catch (err) {
        const store = organizationSettingsStore();
        store.setIsActivePeriod(false);
        this.notificationsEnabled = true;
        throw err;
      }
    },
    async quit() {
      try {
        localStorage.removeItem("VKAccessToken");
        await axios.get(API_URIS.logOutURL);
        this.$router.push("/login");
      } catch (err) {
        notify(
          err?.response?.data || err?.message || this.$t("notification.error")
        );
        throw err;
      }
    },
    cancelQuit() {
      this.logoutWindowEnabled = false;
    },
    openOrCloseNotifications() {
      this.notificationsEnabled ^= true;
    },
    closeNotifications() {
      this.notificationsEnabled = false;
    },
    getIconColor() {
      let generalBrand = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--generalBrand");
      return generalBrand;
    },

    getImageURL: getImageURL,
    getImgUrl(imageName) {
      var images = require.context(
        "@/assets/Layouts/MainLayout",
        false,
        /\.png$/
      );
      return images("./" + imageName + ".png");
    },
    photoAddress(photo) {
      if (photo.slice(0, 7) == "http://") return photo;
      else return SERVER_IP + photo;
    },
    async enableOrganizationChange() {
      try {
        const response = await axios.get(API_URIS.userOrganizations);
        this.organizations = response.data;
        this.organizationChangeFormEnabled = true;
      } catch (err) {
        throw err;
      }
    },
    cancelRelogin(organization_id) {
      this.organizationChangeFormEnabled = false;
      if (organization_id) {
        this.getProfileInfo();
        this.$router.push("/organization_administration/" + organization_id);
      }
    },
    async getProfileInfo() {
      try {
        this.profileStore.getProfileInfo();
      } catch (err) {
        throw err;
      }
    },
    goToMainPage() {
      this.$router.push("/main");
    },
    goToProfile() {
      this.$router.push("/other_profile/" + this.profileInfo.id);
    },
    async logout() {
      this.logoutWindowEnabled = true;
    },
  },
  mounted() {
    setTimeout(() => {
      if (!Object.keys(this.organizationSettings.settings).length) {
        return;
      } else {
        this.getCurrentPeriod();
      }
    }, 500);
    this.getProfileInfo();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.header {
  position: relative;
  padding: 24px;
  display: flex;
  gap: 8px;
  justify-content: space-between;
  background-color: transparent !important;
}
._onboarding {
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  z-index: 10000;
}
.quit_confirmation_wrapper {
  position: fixed;
  z-index: 100011111;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.quit_confirmation {
  width: 100%;
  max-width: 541px;
  position: relative;
  box-sizing: border-box;
  border-radius: 24px;
  box-shadow: 0px 12px 24px rgba(138, 138, 138, 0.15);
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
  overflow-y: auto;
  margin: 32px 0;

  font-family: "Ubuntu";
  font-size: 20px;
  font-weight: 500;
  line-height: 23px;
  text-align: center;
}
.action_buttons {
  display: flex;
  gap: 12px;
}
.action_button {
  width: 50%;
  padding: 16px;
  text-align: center;
  border-radius: 6px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.main_page_button {
  display: flex;
  gap: 5.54px;
}
.main_page_logo {
  max-height: 50px;
  max-width: 200px;
}
.main_page_text {
  display: flex;
}
.main_page_text_not_number {
  display: flex;
  flex-direction: column;
  gap: 4.42px;
}
.changes_saved {
  display: flex;
  position: absolute;
  left: 206px;
  top: 35px;
  gap: 12px;
  align-items: center;
  font-family: "Golos";
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}
.changes_saved_icon {
  height: 24px;
  width: 24px;
}
.teamforce_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 600;
  font-size: 15.41px;
  text-align: left;
}
.digital_thakns_text {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 6.61px;
  text-align: left;
  margin-left: 3.31px;
}
.text_360 {
  font-family: "Golos";
  font-style: normal;
  font-weight: 600;
  font-size: 8.74px;
  text-align: left;
}

.profile_and_exit {
  display: flex;
  gap: 12px;
}
.profile {
  display: flex;
  gap: 14px;
}
.relogin_button {
  border-radius: 16px;
  height: 46px;
  padding: 12px;
  /* box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15); */
  display: flex;
  justify-content: center;
  align-items: center;
}
.relogin_button_text {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
}
.profile_info {
  display: flex;
  flex-direction: column;
}
@media (max-width: 1000px) {
  .changes_saved {
    left: 100px;
  }
}
@media (max-width: 650px) {
  .profile_info {
    display: none;
  }
  .header {
    padding: 16px;
  }
  .changes_saved {
    top: 15px;
    left: 80px;
    width: 200px;
  }
}
@media (max-width: 550px) {
  .relogin_button_text {
    font-size: 12px;
  }
  .relogin_button {
    padding: 6px;
  }
}

.name {
  font-family: "Golos";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
}
.role {
  font-family: "Golos";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  text-align: right;
}
.profile_or_exit_button {
  position: relative;
  min-height: 46px;
  min-width: 46px;
  max-height: 46px;
  max-width: 46px;
  border-radius: 50%;
  /* background-color: var(--generalColorWhite); */
  /* overflow: hidden; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.notifications_wrapper {
  position: relative;
}
.notifications_icon {
  height: 24px;
}
.notifications_count {
  top: 0px;
  right: 0px;
  border-radius: 50%;
  min-height: 16px;
  min-width: 16px;
  max-height: 16px;
  max-width: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  font-size: 8px;
}
.profile_or_exit_button_image {
  border-radius: 50%;
  min-height: 46px;
  min-width: 46px;
  max-height: 46px;
  max-width: 46px;
  object-fit: cover;
}
.logout_icon {
  width: 18px;
  height: 16px;
  margin: 0 0 0 4px;
}
</style>