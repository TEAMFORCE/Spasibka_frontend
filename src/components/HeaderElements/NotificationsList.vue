<template>
  <div class="notifications_list general-white-bg">
    <div v-if="!isPeriodActive" class="no_period">
      <div class="icon_wrapper minor-info-secondary-bg">
        <OrganizationIcon />
      </div>
      <div class="notification_description">
        <h1 class="main_header general-contrast-color">
          {{ $t("header.organization") }}
        </h1>
        <h1 class="secondary_header general-secondary-color">
          {{ $t("header.no_active_period") }}
        </h1>
      </div>
    </div>
    <button
      v-if="!isPeriodActive && displayedRole === 'Администратор'"
      class="go_to_period_creation general-brand-bg general-white-color"
      @click="goToPeriodCreation"
    >
      {{ $t("header.launch_period") }}
    </button>
    <div class="main_header no_notifications" v-if="isPeriodActive">
      {{ $t("header.no_notifications") }}
    </div>
  </div>
</template>

<script>
import OrganizationIcon from "@/components/Icons/HeaderIcons/OrganizationIcon.vue";
import { organizationSettingsStore } from "@/store/organization-settings";
import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

export default {
  name: "NotificationsList",
  components: {
    OrganizationIcon,
  },
  data() {
    return {};
  },
  computed: {
    ...mapStores(useProfileStore),
    isPeriodActive() {
      const store = organizationSettingsStore();
      return store?.isActivePeriod;
    },
    profileInfo() {
      return this.profileStore?.profileInfo;
    },
    displayedRole() {
      let role = "";
      for (let i = 0; i < this.profileInfo?.privileged?.length; ++i) {
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
    goToPeriodCreation() {
      this.$router.push({
        name: "OrganizationAdministrationSettings",
        params: {
          id: this.profileInfo.profile.organization_id,
          name: "periods",
        },
        query: {
          openPeriodCreation: true,          
        }
      });
    },
  },
};
</script>

<style scoped>
.notifications_list {
  box-shadow: 0px 4px 15px 0px rgba(25, 25, 25, 0.25);
  transform: translate(calc(-100% + 60px), 10px);
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: 24px;
  gap: 4px;
}
.no_period {
  display: flex;
  gap: 12px;
}
@media (max-width: 500px) {
  .no_period {
    flex-wrap: wrap;
  }
  .notifications_list {
    padding: 12px;
    transform: translate(calc(-100% + 100px), 10px);
  }
  .secondary_header {
    white-space: normal;
  }
}
.icon_wrapper {
  box-sizing: border-box;
  padding: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  min-width: 46px;
  max-height: 46px;
  max-width: 46px;
  border-radius: 50%;
}
.notification_description {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.main_header {
  text-align: left;
  font-size: 16px;
  font-family: "Golos";
  font-weight: 600;
}
.secondary_header {
  text-align: left;
  font-size: 12px;
  font-family: "Golos";
  line-height: 16px;
  font-weight: 500;
  white-space: nowrap;
}
.go_to_period_creation {
  margin-left: 58px;
  margin-bottom: -18px;
  width: fit-content;
  border-radius: 8px;
  padding: 6px 14px;
  font-family: "Roboto";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
}
.no_notifications {
  white-space: nowrap;
}
</style>
