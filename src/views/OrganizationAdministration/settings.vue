<template>
  <div
    class="organization_administration_settings_page main-layout-page general-white-bg"
  >
    <div class="settings_page_header">
      <button
        class="back_to_organization_button tooltip_container"
        @click="goBack"
        :data-tooltip="$t('organization.back')"
      >
        <!-- <img
          src="@/assets/OrganizationAdministrationImages/BackArrow.png"
          alt="back_button"
          class="back_to_organization_button_icon"
        /> -->
        <GoBackIcon class="go_back_icon" />
      </button>
      <h1 class="settings_page_header_title">
        {{ $t("organization.settings.header") }}
      </h1>
    </div>
    <div class="settings_page_tab_panel">
      <button
        v-for="item in settingsNavigation"
        class="tab_item"
        :class="{ active: item.name === activeTab }"
        @click="changeTab(item)"
      >
        {{ item.title }}
      </button>
    </div>
    <div class="tab_content_wrapper">
      <OrganizationSettingsBranding
        v-show="activeTab == 'branding' && activeParam == 'branding'"
        :settings="currentOrganizationSettings"
        @settingsChanged="reloadPage"
      />
      <OrganizationSettingsGeneralSettings
        v-show="activeTab == 'settings' && activeParam == 'settings'"
        :settings="currentOrganizationSettings"
        @settingsChanged="reloadPage"
      />
      <OrganizationSettingsPeriodManagment
        v-show="activeTab == 'periods' && activeParam == 'periods'"
      />
      <OrganizationSettingsTelegramGroups
        v-show="activeTab === 'tg_groups' && activeParam === 'tg_groups'"
      />
      <OrganizationSettingsTransactions
        v-show="activeTab === 'transactions' && activeParam === 'transactions'"
      />
      <OrganizationSettingsAwards
        v-show="activeTab === 'awards' && activeParam === 'awards'"
      />
      <OrganizationSettingsAwardScales
        v-show="activeTab === 'scales' && activeParam === 'scales'"
      />
    </div>
  </div>
</template>

<script>
import OrganizationSettingsBranding from "@/components/OrganizationAdministrationElements/SettingsComponents/branding.vue";
import OrganizationSettingsGeneralSettings from "@/components/OrganizationAdministrationElements/SettingsComponents/general-settings.vue";
import OrganizationSettingsPeriodManagment from "@/components/OrganizationAdministrationElements/SettingsComponents/period-managment.vue";
import OrganizationSettingsTelegramGroups from "@/components/OrganizationAdministrationElements/SettingsComponents/OrganizationSettingsTelegramGroups.vue";
import OrganizationSettingsTransactions from "@/components/OrganizationAdministrationElements/SettingsComponents/OrganizationSettingsTransactions.vue";
import OrganizationSettingsAwardScales from "@/components/OrganizationAdministrationElements/SettingsComponents/OrganizationSettingsAwardScales.vue";

import { ORGANIZATION_SETTINGS_NAVIGATION } from "@/infrastructure/data-sources/organization-settings-navigation";
import { organizationSettingsStore } from "@/store/organization-settings";
import OrganizationSettingsAwards from "@/components/OrganizationAdministrationElements/SettingsComponents/OrganizationSettingsAwards.vue";
import GoBackIcon from "@/components/Icons/OrganizationAdministrationIcons/GoBackIcon.vue";

export default {
  name: "OrganizationAdministrationSettings",
  components: {
    OrganizationSettingsBranding,
    OrganizationSettingsGeneralSettings,
    OrganizationSettingsPeriodManagment,
    OrganizationSettingsTelegramGroups,
    OrganizationSettingsTransactions,
    OrganizationSettingsAwardScales,
    OrganizationSettingsAwards,
    GoBackIcon,
  },
  data() {
    return {
      activeTab: this.$route.params.name,
      activeParam: this.$route.params.name,
      currentOrganizationSettings: null,
      organizationSettings: organizationSettingsStore(),
    };
  },
  mounted() {
    this.getOrganizationInfo();
  },
  computed: {
    settingsNavigation() {
      return ORGANIZATION_SETTINGS_NAVIGATION(this);
    },
  },
  methods: {
    reloadPage() {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    },
    goBack() {
      this.$router.push(
        "/organization_administration/" + this.$route.params.id
      );
    },
    changeTab(item) {
      this.$router.push({
        name: "OrganizationAdministrationSettings",
        params: { id: this.$route.params.id, name: item.name },
      });
      this.activeTab = item.name;
      this.activeParam = item.name;
    },
    goTo(item) {
      this.$router.push({
        name: "OrganizationAdministrationSettings",
        params: { id: this.$route.params.id, name: item.name },
      });
    },
    async getOrganizationInfo() {
      try {
        if (
          this.organizationSettings?.getSettings &&
          Object.keys(this.organizationSettings.getSettings)
        ) {
          if (Object.keys(this.organizationSettings.getSettings).length > 0) {
            this.currentOrganizationSettings =
              this.organizationSettings.getSettings;
          }
        }
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.organization_administration_settings_page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  box-shadow: 0px 4px 70px rgba(119, 119, 119, 0.15);
  padding: 52px 0 0 34px !important;
  border-radius: 24px 0px 0px 0px;
  overflow-x: hidden;
  position: relative;
}
.organization_administration_settings_page::-webkit-scrollbar {
  width: 8px;
}
.organization_administration_settings_page::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary);
  border: 12px solid transparent;
  border-radius: 20px;
  width: 10px;
}
.settings_page_header {
  display: flex;
  align-items: center;
  gap: 24px;
  color: var(--generalContrast);
  width: 100%;
  padding: 0 0 0 18px;
}
.back_to_organization_button {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--secondaryColorBrand);
  display: flex;
  justify-content: center;
  align-items: center;
}
.go_back_icon {
  height: 16px;
  width: 16px;
}
.back_to_organization_button_icon {
  width: 18px;
  height: 18px;
}
@import url("https://fonts.googleapis.com/css2?family=Roboto&family=Ubuntu:wght@500&display=swap");
.settings_page_header_title {
  font-size: 28px;
  font-weight: 500;
  font-family: "Ubuntu";
}
.settings_page_tab_panel {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 0 0 18px;
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
.tab_content_wrapper {
  width: 100%;
  padding: 0 0 0 18px;
}
@media (max-width: 1024px) {
  .organization_administration_settings_page {
    padding: 24px 0 24px 4px !important;
  }
  .settings_page_header {
    padding: 0 0 0 20px;
  }
  .settings_page_tab_panel {
    padding: 0 0 0 20px;
  }
  .tab_content_wrapper {
    padding: 0 0 0 20px;
  }
}
</style>