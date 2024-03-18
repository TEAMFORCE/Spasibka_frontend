<template>
  <div class="onboarding_layout_wrapper">
    <div class="onboarding_layout">
      <Header :isOnboarding="true" />
      <div class="middle">
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "@/components/app/Header.vue";
import Footer from "@/components/app/Footer.vue";

import { organizationSettingsStore } from "@/store/organization-settings";
import { useStore as useProfileStore } from "@/store/profile";
import { mapStores } from "pinia";

export default {
  name: "OnboardingLayout",
  components: {
    Header,
    Footer,
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
  },
  methods: {
    async getStoreOrganizationSettings() {
      await this.organizationSettings.getOrganizationSettings();
    },
    async getProfileInfo() {
      await this.profileStore.getProfileInfo();
    },
  },
  async mounted() {
    await this.getProfileInfo();
    if (this.profileInfo.profile.organization_id) {
      await this.getStoreOrganizationSettings();
    }
  },
};
</script>

<style scoped>
.onboarding_layout_wrapper {
  position: relative;
  background: radial-gradient(
    75.45% 101.63% at 82.88% 0%,
    rgba(241, 89, 41, 0.2) 0%,
    rgba(211, 114, 83, 0) 88.24%
  );
  height: 100vh;
}
.onboarding_layout {
  height: 100%;
  position: relative;
  top: 0px;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0);
}
.onboarding_layout::-webkit-scrollbar {
  width: 8px !important;
  background-color: var(--negativeSecondary) !important;
}
.onboarding_layout::-webkit-scrollbar-thumb {
  background: var(--generalColorSecondary) !important;
  border: 12px solid transparent !important;
  border-radius: 20px !important;
  width: 10px !important;
}
.middle {
  height: 100%;
  max-height: calc(100% - 98px);
  display: flex;
  position: relative;
}
</style>